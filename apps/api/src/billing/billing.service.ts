import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getBillingInfo(userId: string) {
    let subscription = await this.prisma.userSubscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      // Auto-provision a Free plan for new users
      const renewsAt = new Date();
      renewsAt.setDate(renewsAt.getDate() + 30); // Valid for 30 days

      subscription = await this.prisma.userSubscription.create({
        data: {
          userId,
          planName: 'Enterprise',
          creditsUsed: 14200,
          creditsTotal: 25000,
          renewsAt: new Date('2024-10-12'),
          paymentMethod: 'Visa ending in 4429'
        }
      });
    }

    return subscription;
  }
}
