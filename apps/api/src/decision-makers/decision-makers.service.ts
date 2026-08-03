import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DecisionMakersService {
  constructor(private prisma: PrismaService) {}

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
