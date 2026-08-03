import { Controller, Get, Post, Query, Param, UseGuards } from '@nestjs/common';
import { DecisionMakersService } from './decision-makers.service';
import { AiService } from '../ai/ai.service';

@Controller('decision-makers')
export class DecisionMakersController {
  constructor(
    private readonly decisionMakersService: DecisionMakersService,
    private readonly aiService: AiService
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.decisionMakersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.decisionMakersService.findOne(id);
  }

  @Post(':id/insights/generate')
  async generateInsights(@Param('id') id: string) {
    return this.aiService.generateContactInsights(id);
  }
}
