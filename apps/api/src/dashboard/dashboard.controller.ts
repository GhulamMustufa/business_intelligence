import { Controller, Get, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics(@Request() req: any) {
    const userId = req.user.userId;
    return this.dashboardService.getMetrics(userId);
  }
}
