import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import type { IDiscoveryProvider } from '../discovery/interfaces/discovery-provider.interface';
import { EnrichmentService } from './enrichment.service';

export interface GetCompaniesFilters {
  search?: string;
  locations?: string[];
  industries?: string[];
  minEmployees?: number;
  maxEmployees?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    @Inject('DISCOVERY_PROVIDER') private discoveryProvider: IDiscoveryProvider,
    private enrichmentService: EnrichmentService
  ) {}

  async findAll(filters: GetCompaniesFilters) {
    const { search, locations, industries, minEmployees, maxEmployees, page = 1, limit = 25 } = filters;
    const skip = (page - 1) * limit;

    const discoveredNames: string[] = [];

    // --- NEW: Live Discovery Check ---
    // If the user provided a search query or location, we check our remote provider first
    if (search || (locations && locations.length > 0)) {
      const discovered = await this.discoveryProvider.searchBusinesses(search, locations, industries);
      
      // Upsert discovered businesses into our database manually since name is not @unique
      if (discovered.length > 0) {
        for (const business of discovered) {
          discoveredNames.push(business.name);
          
          // Enrich the company data
          const enriched = await this.enrichmentService.enrichCompanyData(business.name, business.website);
          
          const existing = await this.prisma.company.findFirst({
            where: { name: business.name }
          });
          
          if (existing) {
            await this.prisma.company.update({
              where: { id: existing.id },
              data: {
                website: enriched.website || business.website || existing.website,
                logoUrl: enriched.logoUrl || existing.logoUrl,
                linkedInUrl: enriched.linkedInUrl || existing.linkedInUrl,
                location: business.location || existing.location,
                googleRating: business.rating || existing.googleRating,
                phone: business.phone || existing.phone,
              }
            });
          } else {
            await this.prisma.company.create({
              data: {
                name: business.name,
                website: enriched.website || business.website || 'https://example.com',
                logoUrl: enriched.logoUrl || null,
                linkedInUrl: enriched.linkedInUrl || null,
                location: business.location || 'Unknown',
                industry: business.industry || 'Unknown',
                phone: business.phone || null,
                googleRating: business.rating || null,
                baseScore: 50, // Default base score
                employeeSizeMin: 1, // Default required fields
                employeeSizeMax: 10,
                annualRevenue: '$0 - $1M'
              }
            });
          }
        }
      }
    }
    // ---------------------------------

    const where: Prisma.CompanyWhereInput = {};
    const filterConditions: Prisma.CompanyWhereInput[] = [];

    if (search) {
      filterConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { website: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    if (locations && locations.length > 0) {
      // Simplistic location matching for MVP
      filterConditions.push({
        OR: locations.map(loc => ({
          location: { contains: loc, mode: 'insensitive' }
        }))
      });
    }

    if (industries && industries.length > 0) {
      filterConditions.push({
        industry: { in: industries }
      });
    }

    if (minEmployees !== undefined) {
      filterConditions.push({
        employeeSizeMax: { gte: minEmployees }
      });
    }
    if (maxEmployees !== undefined) {
      filterConditions.push({
        employeeSizeMin: { lte: maxEmployees }
      });
    }

    if (filterConditions.length > 0) {
      if (discoveredNames.length > 0) {
        where.OR = [
          { name: { in: discoveredNames } },
          { AND: filterConditions }
        ];
      } else {
        where.AND = filterConditions;
      }
    } else if (discoveredNames.length > 0) {
      where.name = { in: discoveredNames };
    }

    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { baseScore: 'desc' }
      }),
      this.prisma.company.count({ where })
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
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        insights: true,
        techStack: true,
        decisionMakers: true,
        news: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        scoreMetrics: true,
      }
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async addNote(companyId: string, authorId: string, authorName: string, content: string) {
    return this.prisma.internalNote.create({
      data: {
        companyId,
        authorId,
        authorName,
        content
      }
    });
  }

  async getInsights(companyId: string) {
    const insight = await this.prisma.aIInsight.findUnique({
      where: { companyId }
    });
    
    if (!insight) {
      throw new NotFoundException('Insights not found for this company');
    }
    
    return insight;
  }

  async saveLead(userId: string, companyId: string) {
    const existing = await this.prisma.savedLead.findFirst({
      where: {
        userId,
        companyId,
        decisionMakerId: null
      }
    });

    if (existing) {
      return existing;
    }

    return this.prisma.savedLead.create({
      data: {
        userId,
        companyId
      }
    });
  }
}
