import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(userId: string) {
    const [
      totalSavedLeads,
      totalPitches,
      totalFolders,
      userSub,
      recentSearches,
      recentLeads
    ] = await Promise.all([
      this.prisma.savedLead.count({ where: { userId } }),
      this.prisma.outreachDraft.count({ where: { userId } }),
      this.prisma.leadFolder.count({ where: { userId } }),
      this.prisma.userSubscription.findUnique({ where: { userId } }),
      this.prisma.savedSearch.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      this.prisma.savedLead.findMany({
        where: { userId, companyId: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { company: true },
      }),
    ]);

    const creditsRemaining = userSub ? Math.max(0, userSub.creditsTotal - userSub.creditsUsed) : 0;

    return {
      totalSavedLeads,
      totalPitches,
      totalFolders,
      creditsRemaining,
      recentSearches,
      recentLeads,
    };
  }
}
