import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service';

@Controller('saved-searches')
export class SavedSearchesController {
  constructor(private readonly savedSearchesService: SavedSearchesService) {}

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.savedSearchesService.findAll(userId);
  }

  @Post()
  async create(@Req() req: any, @Body() body: { name: string; query: any }) {
    const userId = req.user.sub;
    return this.savedSearchesService.create(userId, body);
  }
}
