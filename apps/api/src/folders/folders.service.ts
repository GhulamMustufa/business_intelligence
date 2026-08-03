import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async getFolders(userId: string) {
    return this.prisma.leadFolder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createFolder(userId: string, name: string) {
    return this.prisma.leadFolder.create({
      data: {
        userId,
        name
      }
    });
  }

  async updateFolder(id: string, name: string) {
    return this.prisma.leadFolder.update({
      where: { id },
      data: { name }
    });
  }

  async deleteFolder(id: string) {
    return this.prisma.leadFolder.delete({
      where: { id }
    });
  }
}
