import { Controller, Get, Post, Param, Query, UseGuards, Request, Body } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AiService } from '../ai/ai.service';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly aiService: AiService
  ) {}

  @Get()
  async getCompanies(
    @Query('search') search?: string,
    @Query('locations') locations?: string,
    @Query('industries') industries?: string,
    @Query('minEmployees') minEmployees?: string,
    @Query('maxEmployees') maxEmployees?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.companiesService.findAll({
      search,
      locations: locations ? locations.split(',') : undefined,
      industries: industries ? industries.split(',') : undefined,
      minEmployees: minEmployees ? parseInt(minEmployees, 10) : undefined,
      maxEmployees: maxEmployees ? parseInt(maxEmployees, 10) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 25,
    });
  }

  @Get(':id/insights')
  async getInsights(@Param('id') id: string) {
    return this.companiesService.getInsights(id);
  }

  @Post(':id/insights/generate')
  async generateInsights(@Param('id') id: string) {
    return this.aiService.generateCompanyInsights(id);
  }

  @Get(':id')
  async getCompanyProfile(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post(':id/notes')
  async addNote(
    @Request() req: any,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    const userId = req.user.userId;
    // Realistically you would fetch the user's name from Clerk or the DB
    const authorName = 'Current User'; 
    return this.companiesService.addNote(id, userId, authorName, content);
  }

  @Post(':id/ai-command')
  async processAiCommand(
    @Param('id') id: string,
    @Body('command') command: string,
  ) {
    // MVP Mock implementation
    return {
      success: true,
      message: `AI processed command "${command}" for company ${id} successfully.`
    };
  }

  @Post(':id/save')
  async saveLead(@Request() req: any, @Param('id') companyId: string) {
    const userId = req.user.userId;
    return this.companiesService.saveLead(userId, companyId);
  }
}
