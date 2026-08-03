import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class OutreachService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService
  ) {}

  async getDraft(userId: string, decisionMakerId: string) {
    return this.prisma.outreachDraft.findUnique({
      where: {
        userId_decisionMakerId: {
          userId,
          decisionMakerId
        }
      }
    });
  }

  async generateDraft(userId: string, decisionMakerId: string, tone: string) {
    const aiResult = await this.aiService.generateOutreachEmail(decisionMakerId, tone);
    
    // Save to database
    return this.prisma.outreachDraft.upsert({
      where: {
        userId_decisionMakerId: {
          userId,
          decisionMakerId
        }
      },
      update: {
        subject: aiResult.subject,
        body: aiResult.body,
        tone,
        bestAngle: aiResult.bestAngle,
        suggestedFollowUp: aiResult.suggestedFollowUp,
        thingsToMention: aiResult.thingsToMention || [],
        versions: [{ subject: aiResult.subject, body: aiResult.body, type: 'System', timestamp: new Date() }]
      },
      create: {
        userId,
        decisionMakerId,
        subject: aiResult.subject,
        body: aiResult.body,
        tone,
        bestAngle: aiResult.bestAngle,
        suggestedFollowUp: aiResult.suggestedFollowUp,
        thingsToMention: aiResult.thingsToMention || [],
        versions: [{ subject: aiResult.subject, body: aiResult.body, type: 'System', timestamp: new Date() }]
      }
    });
  }

  async rewriteDraft(id: string, instruction: string, currentSubject: string, currentBody: string) {
    const draft = await this.prisma.outreachDraft.findUnique({ where: { id } });
    if (!draft) throw new Error('Draft not found');

    const aiResult = await this.aiService.rewriteOutreachEmail(currentSubject, currentBody, instruction);

    const versions = (draft.versions as any[]) || [];
    versions.push({ subject: aiResult.subject, body: aiResult.body, type: 'Auto-rewrite', timestamp: new Date() });

    return this.prisma.outreachDraft.update({
      where: { id },
      data: {
        subject: aiResult.subject,
        body: aiResult.body,
        versions
      }
    });
  }

  async saveDraft(id: string, subject: string, body: string, tone: string) {
    return this.prisma.outreachDraft.update({
      where: { id },
      data: { subject, body, tone }
    });
  }
}
