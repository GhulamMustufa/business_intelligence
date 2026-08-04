import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DecisionMakersService {
  private readonly logger = new Logger(DecisionMakersService.name);
  
  constructor(private prisma: PrismaService) {}

  async findDecisionMakersForCompany(companyId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return [];

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      this.logger.warn('No SERPAPI_KEY found, skipping decision maker lookup.');
      return [];
    }

    // e.g. site:linkedin.com/in ("Found–er" OR "CEO") "LeadForge"
    const query = `site:linkedin.com/in ("Founder" OR "CEO" OR "Owner" OR "Managing Director" OR "President") "${company.name}"`;
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=5`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        this.logger.error(`SerpApi failed: ${response.statusText}`);
        return [];
      }
      const data = await response.json();
      const results = data.organic_results || [];

      const createdDms = [];

      for (const res of results) {
        // e.g. "John Doe - CEO - Company Name | LinkedIn"
        const titleParts = res.title?.split(' - ') || [];
        const name = titleParts[0]?.trim() || 'Unknown';
        const jobTitle = titleParts[1]?.trim() || 'Executive';
        const linkedinUrl = res.link;

        if (linkedinUrl && linkedinUrl.includes('linkedin.com/in')) {
          const dm = await this.prisma.decisionMaker.create({
            data: {
              name,
              title: jobTitle,
              linkedinUrl,
              companyId,
              confidenceScore: 90, // Found directly via search
              emailStatus: 'Pending',
            }
          });
          createdDms.push(dm);
        }
      }
      return createdDms;
    } catch (err) {
      this.logger.error('Error fetching decision makers via SerpApi', err);
      return [];
    }
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 50, search, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.emailStatus = status;
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.decisionMaker.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          company: true
        },
        orderBy: {
          confidenceScore: 'desc'
        }
      }),
      this.prisma.decisionMaker.count({ where })
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string) {
    return this.prisma.decisionMaker.findUnique({
      where: { id },
      include: {
        company: true
      }
    });
  }
}
