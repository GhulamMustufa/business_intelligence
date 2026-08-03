import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedSearchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: { name: string; query: any }) {
    return this.prisma.savedSearch.create({
      data: {
        userId,
        name: data.name,
        query: data.query,
      },
    });
  }
}
