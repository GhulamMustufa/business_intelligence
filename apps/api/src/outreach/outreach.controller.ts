import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { OutreachService } from './outreach.service';

@Controller('outreach')
export class OutreachController {
  constructor(private readonly outreachService: OutreachService) {}

  @Get(':decisionMakerId')
  async getDraft(@Request() req: any, @Param('decisionMakerId') decisionMakerId: string) {
    const userId = req.user.sub;
    return this.outreachService.getDraft(userId, decisionMakerId);
  }

  @Post(':decisionMakerId/generate')
  async generateDraft(
    @Request() req: any,
    @Param('decisionMakerId') decisionMakerId: string,
    @Body('tone') tone: string
  ) {
    const userId = req.user.sub;
    return this.outreachService.generateDraft(userId, decisionMakerId, tone);
  }

  @Post(':id/rewrite')
  async rewriteDraft(
    @Param('id') id: string,
    @Body('instruction') instruction: string,
    @Body('currentSubject') currentSubject: string,
    @Body('currentBody') currentBody: string
  ) {
    return this.outreachService.rewriteDraft(id, instruction, currentSubject, currentBody);
  }

  @Put(':id')
  async saveDraft(
    @Param('id') id: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
    @Body('tone') tone: string
  ) {
    return this.outreachService.saveDraft(id, subject, body, tone);
  }
}
