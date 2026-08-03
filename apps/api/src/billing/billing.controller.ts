import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  async getBillingInfo(@Req() req: any) {
    const userId = req.user.sub;
    return this.billingService.getBillingInfo(userId);
  }
}
