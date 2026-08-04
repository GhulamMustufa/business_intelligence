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

    let techSignalsContext = 'No tech/hiring signals found.';
    let growthSignalsContext = 'No growth signals found.';
    let appSignalsContext = 'No mobile app signals found.';
    const apiKey = process.env.SERPAPI_KEY;
    
    if (apiKey) {
      try {
        // Query 1: Looking for tech hiring or manual labor (Data Entry) which indicates a need for dev/automation
        const techQuery = `"${company.name}" hiring (developer OR engineer OR "data entry" OR "IT" OR "software")`;
        const techUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(techQuery)}&api_key=${apiKey}&num=10`;
        
        // Query 2: Looking for growth or digital transformation which indicates budget for new apps/websites
        const growthQuery = `"${company.name}" (expansion OR "digital transformation" OR "new website" OR "app launch" OR "new location")`;
        const growthUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(growthQuery)}&api_key=${apiKey}&num=10`;

        // Query 3: Checking if they already have an app or are looking to build one
        const appQuery = `(site:apps.apple.com OR site:play.google.com) "${company.name}" OR "${company.name}" ("mobile app" OR iOS OR Android)`;
        const appUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(appQuery)}&api_key=${apiKey}&num=10`;
        
        const [techRes, growthRes, appRes] = await Promise.all([fetch(techUrl), fetch(growthUrl), fetch(appUrl)]);
        
        if (techRes.ok) {
          const data = await techRes.json();
          const results = data.organic_results || [];
          techSignalsContext = results.map((r: any) => `${r.title} - ${r.snippet}`).join('\\n');
        }

        if (growthRes.ok) {
          const data = await growthRes.json();
          const results = data.organic_results || [];
          growthSignalsContext = results.map((r: any) => `${r.title} - ${r.snippet}`).join('\\n');
        }

        if (appRes.ok) {
          const data = await appRes.json();
          const results = data.organic_results || [];
          appSignalsContext = results.map((r: any) => `${r.title} - ${r.snippet}`).join('\\n');
        }
      } catch (err) {
        console.warn('Failed to fetch SerpApi context', err);
      }
    }

    const systemPrompt = `You are an elite, aggressive B2B sales strategist for a high-end Web Development and AI Automation Agency. 
Your mission is to analyze this prospect and ruthlessly identify their digital weaknesses, operational bottlenecks, and reasons they urgently need a new website, a mobile app, or AI automation.
Analyze their industry, size, and the provided Google search context (hiring, growth, and mobile app signals). 

CRITICAL INSTRUCTIONS:
- If they have no mobile app, suggest pitching a mobile app as a competitive differentiator.
- If they are hiring data entry/admin staff, pitch AI automation to replace manual labor.
- If they are expanding/growing, pitch a web/app rebuild to support scaling.
- Estimate their employee headcount (e.g. 10, 50) and annual revenue (e.g. "$1M - $5M") based on context.
- Deduce technical problems (e.g. "No SSL", "Slow website") and put them in "digitalWeaknesses".
- Map all "criticalPainPoints" and "digitalWeaknesses" directly to the services you sell.
- Be highly specific and factual. Do not hallucinate.

You must return a valid JSON object strictly matching this structure:
{
  "whyMatch": "A ruthless, compelling paragraph on exactly why they urgently need web/app development or AI automation.",
  "buyingSignals": [
    {
      "icon": "Material Symbols icon name, e.g., trending_up",
      "title": "Short title for the signal",
      "description": "Detailed description of the buying signal (e.g. from news)"
    }
  ],
  "outreachStrategy": "A sharp, actionable Cold Email or LinkedIn Voice Note strategy.",
  "criticalPainPoints": ["Pain point 1", "Pain point 2"],
  "companyMaturity": "Estimated company maturity based on context",
  "digitalWeaknesses": ["Weakness 1", "Weakness 2"],
  "growthScore": 85,
  "aiReadiness": "Assessment of AI readiness",
  "likelihoodToNeedServices": "Assessment of likelihood to need services",
  "suggestedSalesAngle": "A brilliant, unique sales angle or 'Cold Email Hook' to grab their attention.",
  "recommendedOutreach": "Recommended outreach message or next step",
  "estimatedEmployeesMin": 10,
  "estimatedEmployeesMax": 50,
  "estimatedRevenue": "$1M - $5M",
  "websiteScore": 42,
  "recommendedServices": ["Website redesign", "AI chatbot"],
  "estimatedProjectValue": "$8,000–15,000"
}`;

    const userPrompt = `
      Company Name: ${company.name}
      Industry: ${company.industry}
      Location: ${company.location}
      Employees: ${company.employeeSizeMin}-${company.employeeSizeMax}
      Tech Stack: ${company.techStack.map(t => t.name).join(', ')}
      Tech/Hiring Context:
      ${techSignalsContext}
      Growth Context:
      ${growthSignalsContext}
      Mobile App Context (App Store presence or app-related news):
      ${appSignalsContext}
    `;

    const aiResult = await this.generateWithRetry(systemPrompt, userPrompt);

    const finalResult = aiResult || {
      whyMatch: `${company.name} recently appeared in the news. Analyzing their public profile indicates expansion.`,
      buyingSignals: [
        { icon: 'trending_up', title: 'Recent Activity', description: 'Company is active online.' }
      ],
      outreachStrategy: `"I noticed your recent news online. Many leaders in ${company.industry} struggle with..."`,
      criticalPainPoints: ['Manual reporting', 'Tool sprawl'],
      companyMaturity: 'Growth Phase',
      digitalWeaknesses: ['Needs modernized web presence', 'No chatbot'],
      estimatedEmployeesMin: 1,
      estimatedEmployeesMax: 10,
      estimatedRevenue: "$0 - $1M",
      websiteScore: 42,
      recommendedServices: ["Website redesign", "AI chatbot"],
      estimatedProjectValue: "$5,000–10,000"
    };

    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        employeeSizeMin: finalResult.estimatedEmployeesMin || 1,
        employeeSizeMax: finalResult.estimatedEmployeesMax || 10,
        annualRevenue: finalResult.estimatedRevenue || "$0 - $1M"
      }
    });

    return this.prisma.aIInsight.upsert({
      where: { companyId },
      update: {
        whyMatch: finalResult.whyMatch,
        buyingSignals: finalResult.buyingSignals,
        outreachStrategy: finalResult.outreachStrategy,
        criticalPainPoints: finalResult.criticalPainPoints || [],
        companyMaturity: finalResult.companyMaturity,
        digitalWeaknesses: finalResult.digitalWeaknesses || [],
        websiteScore: finalResult.websiteScore || 50,
        recommendedServices: finalResult.recommendedServices || [],
        estimatedProjectValue: finalResult.estimatedProjectValue || "N/A"
      },
      create: {
        companyId,
        whyMatch: finalResult.whyMatch,
        buyingSignals: finalResult.buyingSignals,
        outreachStrategy: finalResult.outreachStrategy,
        criticalPainPoints: finalResult.criticalPainPoints || [],
        companyMaturity: finalResult.companyMaturity,
        digitalWeaknesses: finalResult.digitalWeaknesses || [],
        websiteScore: finalResult.websiteScore || 50,
        recommendedServices: finalResult.recommendedServices || [],
        estimatedProjectValue: finalResult.estimatedProjectValue || "N/A"
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
