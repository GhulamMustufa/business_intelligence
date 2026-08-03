import { Controller, Get, Post, Body, Query, Req, UseGuards, Res } from '@nestjs/common';
import { SavedLeadsService } from './saved-leads.service';
import type { Response } from 'express';

@Controller('saved-leads')
export class SavedLeadsController {
  constructor(private readonly savedLeadsService: SavedLeadsService) {}

  @Get()
  async findAll(@Req() req: any, @Query() query: any) {
    const userId = req.user.sub;
    return this.savedLeadsService.findAll(userId, query);
  }

  @Get('export')
  async exportLeads(@Req() req: any, @Query() query: any, @Res() res: Response) {
    const userId = req.user.sub;
    const csvString = await this.savedLeadsService.exportLeads(userId, query);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leadforge_export.csv"');
    res.send(csvString);
  }

  @Post('bulk-move')
  async bulkMove(@Req() req: any, @Body() body: { leadIds: string[], folderId: string | null }) {
    const userId = req.user.sub;
    return this.savedLeadsService.bulkMove(userId, body.leadIds, body.folderId);
  }
}
