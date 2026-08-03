import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  
  constructor(private prisma: PrismaService) {
    const apiKey = process.env.DEEPSEEK_API_KEY || 'MOCK_API_KEY';
    if (apiKey !== 'MOCK_API_KEY') {
      this.openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.deepseek.com',
      });
    }
  }

  private async generateWithRetry(systemPrompt: string, userPrompt: string, maxRetries = 2) {
    if (!this.openai) {
      console.warn("Using mock AI response since DEEPSEEK_API_KEY is missing or invalid");
      return null;
    }

    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content || '{}');
      } catch (error) {
        attempt++;
        console.error(`AI Generation failed (attempt ${attempt}):`, error);
        if (attempt >= maxRetries) {
          console.warn("Falling back to mock AI data due to persistent API errors (e.g. rate limit/billing).");
          return null;
        }
      }
    }
  }

  async generateCompanyInsights(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { techStack: true }
    });

    if (!company) throw new InternalServerErrorException('Company not found');

    const systemPrompt = `You are an expert B2B sales intelligence AI. Analyze the provided company profile and generate structured insights.
You must return a valid JSON object strictly matching this structure:
{
  "whyMatch": "A brief, compelling paragraph on why this company is a great match.",
  "buyingSignals": [
    {
      "icon": "Material Symbols icon name, e.g., trending_up",
      "title": "Short title for the signal",
      "description": "Detailed description of the buying signal"
    }
  ],
  "outreachStrategy": "Customized outreach strategy paragraph.",
  "criticalPainPoints": ["Pain point 1", "Pain point 2"],
  "companyMaturity": "Estimated company maturity, e.g., Series A Startup, Enterprise",
  "digitalWeaknesses": ["Weakness 1", "Weakness 2"],
  "growthScore": 85,
  "aiReadiness": "Assessment of AI readiness",
  "likelihoodToNeedServices": "Assessment of likelihood to need services",
  "suggestedSalesAngle": "Suggested sales angle",
  "recommendedOutreach": "Recommended outreach message or next step"
}`;

    const userPrompt = `
      Company Name: ${company.name}
      Industry: ${company.industry}
      Location: ${company.location}
      Employees: ${company.employeeSizeMin}-${company.employeeSizeMax}
      Tech Stack: ${company.techStack.map(t => t.name).join(', ')}
    `;

    const aiResult = await this.generateWithRetry(systemPrompt, userPrompt);

    const finalResult = aiResult || {
      whyMatch: `${company.name} recently expanded their operations. Their current tech stack lacks automated governance tools.`,
      buyingSignals: [
        { icon: 'trending_up', title: 'Recent Growth', description: 'Significant increase in headcount.' }
      ],
      outreachStrategy: `"I noticed your recent expansion. Many leaders in ${company.industry} struggle with..."`,
      criticalPainPoints: ['Manual reporting', 'Tool sprawl'],
      companyMaturity: 'Growth Phase',
      digitalWeaknesses: ['No active LinkedIn presence', 'Basic website conversion path']
    };

    return this.prisma.aIInsight.upsert({
      where: { companyId },
      update: {
        whyMatch: finalResult.whyMatch,
        buyingSignals: finalResult.buyingSignals,
        outreachStrategy: finalResult.outreachStrategy,
        criticalPainPoints: finalResult.criticalPainPoints || [],
        companyMaturity: finalResult.companyMaturity,
        digitalWeaknesses: finalResult.digitalWeaknesses || []
      },
      create: {
        companyId,
        whyMatch: finalResult.whyMatch,
        buyingSignals: finalResult.buyingSignals,
        outreachStrategy: finalResult.outreachStrategy,
        criticalPainPoints: finalResult.criticalPainPoints || [],
        companyMaturity: finalResult.companyMaturity,
        digitalWeaknesses: finalResult.digitalWeaknesses || []
      }
    });
  }

  async generateContactInsights(decisionMakerId: string) {
    const dm = await this.prisma.decisionMaker.findUnique({
      where: { id: decisionMakerId },
      include: { company: true }
    });

    if (!dm) throw new InternalServerErrorException('Decision Maker not found');

    const systemPrompt = `You are an expert B2B sales intelligence AI. Analyze this decision maker and generate outreach insights.
You must return a valid JSON object strictly matching this structure:
{
  "aiPriorityMatch": "1-2 sentence rationale explaining why this person is a strong prospect.",
  "matchTags": ["Tag 1", "Tag 2"],
  "suggestedOutreach": [
    {
      "context": "Context or angle of the message, e.g. Recent Promotion",
      "text": "The actual hook or message snippet in quotes"
    }
  ]
}`;

    const userPrompt = `
      Name: ${dm.name}
      Title: ${dm.title}
      Department: ${dm.department || 'Unknown'}
      Company: ${dm.company.name} (${dm.company.industry})
    `;

    const aiResult = await this.generateWithRetry(systemPrompt, userPrompt);

    const finalResult = aiResult || {
      aiPriorityMatch: `${dm.title}s are typically responsible for software procurement in ${dm.company.industry}.`,
      matchTags: ['Key Target'],
      suggestedOutreach: [
        { context: 'General Outreach', text: `"Noticed you are leading ${dm.department} at ${dm.company.name}..."` }
      ]
    };

    return this.prisma.decisionMaker.update({
      where: { id: decisionMakerId },
      data: {
        aiPriorityMatch: finalResult.aiPriorityMatch,
        matchTags: finalResult.matchTags,
        suggestedOutreach: finalResult.suggestedOutreach
      }
    });
  }

  async generateOutreachEmail(decisionMakerId: string, tone: string) {
    const dm = await this.prisma.decisionMaker.findUnique({
      where: { id: decisionMakerId },
      include: { company: { include: { techStack: true } } }
    });

    if (!dm) throw new InternalServerErrorException('Decision Maker not found');

    const systemPrompt = `You are an expert SDR writing a cold outreach email.
Write a compelling, concise email. Do not use placeholders other than {{first_name}} and {{company}}.
Additionally, formulate an overarching campaign strategy for this prospect.
You must return a valid JSON object strictly matching this structure:
{
  "subject": "Email subject",
  "body": "Email body",
  "bestAngle": "Focus on their tech stack growth and operational efficiency.",
  "suggestedFollowUp": "Follow up message",
  "thingsToMention": ["Point 1", "Point 2"]
}`;

    const userPrompt = `
      Target: ${dm.name}, ${dm.title} at ${dm.company.name}
      Company Context: ${dm.company.industry}, Location: ${dm.company.location}
      Tone: ${tone}
    `;

    const aiResult = await this.generateWithRetry(systemPrompt, userPrompt);

    if (aiResult) return aiResult;

    return {
      subject: `Ideas for ${dm.company.name}'s tech stack`,
      body: `Hi {{first_name}},\n\nI noticed you are leading the team at {{company}}. Given your role, I thought you might be interested in how we help companies in your space.\n\nLet's chat next week.\n\nBest,\nLeadForge AI`,
      bestAngle: "Focus on their tech stack growth and operational efficiency.",
      suggestedFollowUp: `Hi {{first_name}}, following up on my previous note. Let me know if you have 5 minutes next week.`,
      thingsToMention: ["Recent funding round", "Hiring in engineering"]
    };
  }

  async rewriteOutreachEmail(currentSubject: string, currentBody: string, instruction: string) {
    const systemPrompt = `You are an expert SDR editor. Rewrite the email based on the instruction.
Return a structured JSON with 'subject' and 'body'. Keep {{first_name}} and {{company}} placeholders intact.
You must return a valid JSON object strictly matching this structure:
{
  "subject": "Rewritten subject",
  "body": "Rewritten body"
}`;

    const userPrompt = `
      Instruction: "${instruction}"
      Current Subject: ${currentSubject}
      Current Body: ${currentBody}
    `;

    const aiResult = await this.generateWithRetry(systemPrompt, userPrompt);

    if (aiResult) return aiResult;

    return {
      subject: currentSubject,
      body: `[Rewritten]: ${currentBody}`
    };
  }
}
