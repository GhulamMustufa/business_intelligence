import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedLeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: any = {}) {
    const { page = 1, limit = 50, folderId, tag, search, sortBy } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    
    if (folderId !== undefined) {
      where.folderId = folderId === 'null' ? null : folderId;
    }
    
    if (tag) {
      where.tags = { has: tag };
    }
    
    if (search) {
      where.OR = [
        { decisionMaker: { name: { contains: search, mode: 'insensitive' } } },
        { company: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'score') {
      orderBy = { decisionMaker: { confidenceScore: 'desc' } };
    } else if (sortBy === 'name') {
      orderBy = { decisionMaker: { name: 'asc' } };
    }

    const [items, total] = await Promise.all([
      this.prisma.savedLead.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          decisionMaker: true,
          company: true
        },
        orderBy
      }),
      this.prisma.savedLead.count({ where })
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  async exportLeads(userId: string, query: any = {}) {
    const { folderId, tag, search, sortBy } = query;
    const where: any = { userId };
    
    if (folderId !== undefined) {
      where.folderId = folderId === 'null' ? null : folderId;
    }
    
    if (tag) {
      where.tags = { has: tag };
    }
    
    if (search) {
      where.OR = [
        { decisionMaker: { name: { contains: search, mode: 'insensitive' } } },
        { company: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'score') {
      orderBy = { decisionMaker: { confidenceScore: 'desc' } };
    } else if (sortBy === 'name') {
      orderBy = { decisionMaker: { name: 'asc' } };
    }

    const leads = await this.prisma.savedLead.findMany({
      where,
      include: {
        decisionMaker: true,
        company: true
      },
      orderBy
    });

    const headers = [
      'Name',
      'Title',
      'Company Name',
      'Industry',
      'Location',
      'Confidence Score',
      'Match Tags'
    ];

    const rows = leads.map(lead => {
      const dm = lead.decisionMaker;
      const comp = lead.company;
      
      const row = [
        dm?.name || '',
        dm?.title || '',
        comp?.name || '',
        comp?.industry || '',
        comp?.location || '',
        dm?.confidenceScore?.toString() || '',
        (lead.tags || []).join('; ')
      ];
      
      return row.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  async bulkMove(userId: string, leadIds: string[], folderId: string | null) {
    return this.prisma.savedLead.updateMany({
      where: {
        id: { in: leadIds },
        userId
      },
      data: { folderId }
    });
  }
}
