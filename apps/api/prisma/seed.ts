import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.savedLead.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.techStack.deleteMany();
  await prisma.decisionMaker.deleteMany();
  await prisma.companyNews.deleteMany();
  await prisma.internalNote.deleteMany();
  await prisma.companyScore.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create mock user
  const org = await prisma.organization.create({
    data: { name: 'Acme Corp' }
  });
  
  const user = await prisma.user.create({
    data: {
      clerkId: 'user_mock_1',
      email: 'alex@acme.com',
      firstName: 'Alex',
      lastName: 'Mercer',
      organizationId: org.id
    }
  });

  // Create Mock Companies
  // Vanguard Systems Corp (From Company Profile Design)
  const vanguard = await prisma.company.create({
    data: {
      name: 'Vanguard Systems Corp.',
      industry: 'Enterprise SaaS',
      location: 'Palo Alto, CA',
      employeeSizeMin: 1000,
      employeeSizeMax: 5000,
      website: 'vanguard-systems.io',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoXWuQ4TfI0HbcxCOJkHFHRqqBMbgm0mAYaRZTKNq_1xI5HuWJGEefKVB8rHZ5y4sMQ_lVIv9uZTsJLuM9KGzgmPmFgSSZKkUOG6jnw0QC47DRPC6_TmBx-ljNoKQA99Oi1Trb15m-3gxO2jXIkIPf7MOGe357KCkZ-HQdv3OSUwLT55u6E_FVBFSihyRRsUG9jUxUAxkNTb_o6HKUDo8M2EpeCbA-j1wmFs9IiZ4HQjJGmnKZabrnhA',
      baseScore: 94,
      matchLabel: 'Excellent',
      annualRevenue: '$1.24B',
      marketShare: '12.5%',
      headcount: '4,200+',
      confidence: 96,
      recentActivity: 'Announced $250M EMEA Expansion',
      googleRating: 4.8,
      websiteQuality: 'Modern, Next.js based, highly optimized',
      socialPresence: 'Active on LinkedIn, Dormant on Twitter',
      services: ['Enterprise Data', 'Predictive Analytics', 'SaaS Solutions'],
      
      insights: {
        create: {
          whyMatch: 'Vanguard Systems Corp. is a leading provider of enterprise data management and predictive analytics solutions. Founded in 2014, the company has transitioned from a niche infrastructure provider to a global SaaS powerhouse, serving 45% of the Fortune 500.',
          buyingSignals: [
            { icon: 'rocket_launch', title: 'New EMEA HQ', description: 'Expanding into Europe' },
            { icon: 'bolt', title: 'AI R&D Increase', description: 'Investing heavily in AI capabilities' },
            { icon: 'hub', title: 'Series D Round', description: 'Just closed Series D funding' }
          ],
          criticalPainPoints: [
            'Legacy CRM integration creating data silos across regional teams.',
            'High churn in mid-market segment due to platform latency.'
          ],
          companyMaturity: 'Enterprise (Scaling)',
          digitalWeaknesses: [
            'No automated lead scoring mechanism',
            'Poor SEO structure on blog articles'
          ],
          outreachStrategy: 'Based on the recent EMEA expansion news, send the "International Compliance" deck to Marcus Thorne.',
          growthScore: 92,
          aiReadiness: 'High - Ready for specialized implementation',
          likelihoodToNeedServices: 'Very High - Actively expanding',
          suggestedSalesAngle: 'Lead with compliance and localization features for their new EMEA expansion.',
          recommendedOutreach: 'Email CTO directly referencing the EMEA announcement and proposing a quick sync on scalable data infrastructure.'
        }
      },
      scoreMetrics: {
        create: {
          fitScore: 'Excellent',
          intentSignal: 'Very High',
          technographicMatch: '88%'
        }
      },
      techStack: {
        create: [
          { name: 'AWS Infrastructure', status: 'Active', icon: 'cloud' },
          { name: 'Snowflake Data', status: 'Recent', icon: 'terminal' },
          { name: 'Crowdstrike', status: 'Active', icon: 'shield' },
          { name: 'Salesforce CRM', status: 'Competitor', icon: 'dns' }
        ]
      },
      decisionMakers: {
        create: [
          { 
            name: 'Sarah Mitchell', 
            title: 'VP of Engineering', 
            photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7s70t47WlOyQ0O5PdF_1RtBwQ97eAaGz8D9Uz7-NDbWn0YU_2q5JUmC16OThLzEtSSp0vN6uDiiy0Dfcav9VVg8A8FPhHBe9I0TBnQhyKlN-t1Elx_Pi0IgVEkEakJ6ihInNJIbQTddcett0QaXwa7IzDjdf3In5P-2NQ6ELdjK1q1hsrVkR11Ok23flJDfsfOuDoL-VlVuIiOtbHqcCu2tRix8uVaak6SHgpWm6HCm7rRBCbGFJzAQ',
            emailDomain: '@microsoft.com',
            department: 'Infrastructure',
            emailStatus: 'Verified',
            confidenceScore: 98.4,
            aiPriorityMatch: 'High value due to recent Series D funding and a 20% team expansion in Infrastructure. Her tech stack (Kubernetes, Go, AWS) aligns 94% with your solution\'s core integration capabilities.',
            matchTags: ['High Intent', 'Decision Maker'],
            suggestedOutreach: [
              { context: 'Recent Promotion', text: '"Congrats on the VP role, Sarah. Saw Microsoft is pushing hard on edge-computing infra—wondering if your team has explored..."' },
              { context: 'Tech Stack Pain', text: '"Notice you\'re scaling Kubernetes clusters rapidly. Usually, that introduces visibility gaps in multi-region deployments. We built..."' }
            ]
          },
          { 
            name: 'Marcus Thorne', 
            title: 'CTO & VP of Product', 
            photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPvsvXKkRLZvd33spnjFvPInvUGDtGJmVgsuCQZgRXIod52A4sDLHUnqWObYFwp3SRfGiWbUiRrDDBVIp1JfR3PLqhmQ40gQ_n11zyoFEg-oIacraQuti5H75EVJrgF8QxCf1hIjqTOTxcMkAeYnNUjjRqmnASf2jmO1btbQUTJhmEU5CRVypb8RW3Tc8C83eyl0mSK3uMfm31TXw1PX9oLL7lX3sfv7nUDtdjcBDh9-QsuRCsuhmnEw',
            emailDomain: '@vanguard-systems.io',
            department: 'Executive',
            emailStatus: 'Verified',
            confidenceScore: 95.0,
            aiPriorityMatch: 'Recently appointed CTO driving the "Data Unity" initiative.',
            matchTags: ['Key Target', 'Executive'],
            suggestedOutreach: []
          },
          { 
            name: 'Elena Rodriguez', 
            title: 'Chief Financial Officer', 
            photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdPW28e_vLeNiLhvDPBGAP_PqoVLYtxf89yFZ42vIEM93-ybggMo4TE8l-ia1xzQ3289ZgyCDcp4hXe9n-x6vZb4lDZKG8LxPeATO6n0PGxqFBAfdtW50e-XqNyWJp9ISgvc2O1WXDU5I_SCzhg1QBEx-wol0CljxnEX4r_weqjDx2Y8qNAUdlwVB0RdulfNPhqslccdBINGJvBPysMWkyCXCAhjDmtFXckaKpY8O5g-sT4dg9_gcTVA',
            emailDomain: '@vanguard-systems.io',
            department: 'Finance',
            emailStatus: 'Pending',
            confidenceScore: 82.5,
            aiPriorityMatch: 'Controls the budget for Q1 tech stack overhaul.',
            matchTags: ['Budget Holder'],
            suggestedOutreach: []
          },
          { 
            name: 'Sarah Jenkins', 
            title: 'Director of Revenue Ops', 
            photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfhMxSmwjKuHMe969f-U-KPGp31qWXFWN3CuGkTIPccAAnNdU1VaWPAD-wezuRvnWWkrXRavvAMmwPK9om_s11yZGELtj_JNMOa7kMm0OAW1Md8FLhbmaxjF6NU9AHZItobtDhELUjs3Eu_XD0Ie2roqUIuVgp3f3tTkdwTWsrV6cx975dykzPky2Z0CFRUTKjdWSt6731RK_dZl0skGD6RGjjEvP1UdTaGwpIdsV_ghGgxuZV0yyAng',
            emailDomain: '@vanguard-systems.io',
            department: 'Revenue',
            emailStatus: 'Verified',
            confidenceScore: 91.2,
            aiPriorityMatch: 'Leading the CRM integration project.',
            matchTags: ['Champion'],
            suggestedOutreach: []
          }
        ]
      },
      news: {
        create: [
          { dateLabel: '2 DAYS AGO', title: 'Vanguard Systems Announces $250M EMEA Expansion', summary: 'The company plans to hire over 400 new employees in Berlin and London by year-end...' },
          { dateLabel: '1 WEEK AGO', title: 'Partnership with Microsoft Azure Confirmed', summary: 'New cloud-native workloads to be migrated from AWS starting Q1 next year...' },
          { dateLabel: '2 WEEKS AGO', title: 'New CTO Marcus Thorne Prioritizes Data Unity', summary: 'Internal memo leaks suggesting a shift toward modernizing legacy CRM infrastructure...' }
        ]
      },
      notes: {
        create: [
          { authorId: 'user_mock_1', authorName: 'Alex Mercer (Sales Manager)', content: 'Spoke with Sarah in RevOps. They are definitely looking for a tool that can bridge the Salesforce-AWS gap. Initial budget is set for Q1. Follow up next Tuesday with the integration whitepaper.' }
        ]
      }
    }
  });

  const cyber = await prisma.company.create({
    data: {
      name: 'CyberShield Systems',
      industry: 'Cybersecurity',
      location: 'New York, NY',
      employeeSizeMin: 500,
      employeeSizeMax: 2500,
      website: 'cybershield.io',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxjYBYnUDNVme1VgxpnrxR2lurm7nBc8wgSInaPmUdG1pAUlyW_sLon6PNFMLFxr7cS4C4LB0PiRx77fzZoU1PyKjwgrJf6n0mBkbemD5HQtMABL3vB1zMbvN-OVK6ZVdQ1sMT9hIZcBaipESt2gV4S-r879Pl8MSehld1YFDDJFwBp33PM88X235DIjOIso0IskozJSt2xXVn_KnEQu2i-aggXGI7QfQ7jc4XlPxRzlt6d3TXNHEdvQ',
      baseScore: 98,
      matchLabel: 'Perfect Match',
      insights: {
        create: {
          whyMatch: 'CyberShield recently expanded their AWS infrastructure by 40%. Their current stack lacks the automated governance tools your product provides.',
          buyingSignals: [
            { icon: 'trending_up', title: 'Recent Funding', description: 'Series C raised $120M last month.' },
            { icon: 'person_add', title: 'Aggressive Hiring', description: '15+ open roles in DevOps and Security.' },
            { icon: 'language', title: 'Tech Stack Change', description: 'Just migrated to Kubernetes/EKS.' }
          ],
          outreachStrategy: '"I noticed your recent expansion into EKS. Many CISOs at CyberShield\'s scale struggle with multi-region compliance during this transition..."'
        }
      },
      decisionMakers: {
        create: [
          {
            name: 'David Rodriguez',
            title: 'Lead Solutions Architect',
            emailDomain: '@aws.amazon.com',
            department: 'Cloud Operations',
            emailStatus: 'Pending',
            confidenceScore: 92.1,
            matchTags: [],
            aiPriorityMatch: 'Responsible for recent EKS migration.'
          },
          {
            name: 'Thomas Klein',
            title: 'CTO',
            emailDomain: '@stripe.com',
            department: 'Executive',
            emailStatus: 'Bounced',
            confidenceScore: 89.4,
            matchTags: [],
            aiPriorityMatch: 'Key decision maker for security tooling.'
          }
        ]
      }
    }
  });

  const vortex = await prisma.company.create({
    data: {
      name: 'Vortex Cloud',
      industry: 'Cloud Infrastructure',
      location: 'Austin, TX',
      employeeSizeMin: 250,
      employeeSizeMax: 500,
      website: 'vortex.cloud',
      logoUrl: null,
      baseScore: 78,
      matchLabel: 'Good',
      confidence: 81,
      recentActivity: 'Closed Series B Funding',
      googleRating: 4.2,
      websiteQuality: 'Average, slow load times on mobile',
      socialPresence: 'Active on Twitter, Minimal LinkedIn',
      services: ['Cloud Cost Management', 'AWS Optimization'],
      insights: {
        create: {
          whyMatch: 'Vortex Cloud is rapidly acquiring new enterprise customers and needs better cost management solutions.',
          buyingSignals: [
            { icon: 'language', title: 'Tech Stack Change', description: 'Adopting a multi-cloud strategy.' }
          ],
          companyMaturity: 'Series B (Growth)',
          digitalWeaknesses: [
            'No interactive demos on website',
            'Blog not updated in 6 months'
          ],
          outreachStrategy: '"As you adopt a multi-cloud strategy, managing cross-provider spend becomes critical..."',
          growthScore: 78,
          aiReadiness: 'Medium - Basic tools adopted',
          likelihoodToNeedServices: 'Moderate - Needs tech consolidation',
          suggestedSalesAngle: 'Focus on cost-savings of multi-cloud consolidation.',
          recommendedOutreach: 'Target Director of Product on LinkedIn with a case study of similar cost savings.'
        }
      },
      decisionMakers: {
        create: [
          {
            name: 'Elena Lysenko',
            title: 'Director of Product',
            emailDomain: '@google.com',
            department: 'AI Systems',
            emailStatus: 'Verified',
            confidenceScore: 96.8,
            matchTags: [],
            aiPriorityMatch: 'Leading new AI initiatives and multi-cloud adoption.'
          }
        ]
      }
    }
  });

  console.log('Seeding completed. Creating Saved Leads...');

  const f1 = await prisma.leadFolder.create({ data: { userId: user.id, name: 'Q4 Tech Campaign' } });
  const f2 = await prisma.leadFolder.create({ data: { userId: user.id, name: 'Mid-Market SaaS' } });
  const f3 = await prisma.leadFolder.create({ data: { userId: user.id, name: 'EMEA Expansion' } });

  // Create some saved leads for the user
  const dmSarah = await prisma.decisionMaker.findFirst({ where: { name: 'Sarah Mitchell' } });
  const dmMarcus = await prisma.decisionMaker.findFirst({ where: { name: 'Marcus Thorne' } });
  const dmElena = await prisma.decisionMaker.findFirst({ where: { name: 'Elena Rodriguez' } });

  if (dmSarah && dmMarcus && dmElena) {
    await prisma.savedLead.createMany({
      data: [
        {
          userId: user.id,
          decisionMakerId: dmSarah.id,
          companyId: vanguard.id,
          tags: ['HIGH INTENT'],
          folderId: f1.id
        },
        {
          userId: user.id,
          decisionMakerId: dmMarcus.id,
          companyId: vanguard.id,
          tags: ['DECISION MAKER'],
          folderId: f2.id
        },
        {
          userId: user.id,
          decisionMakerId: dmElena.id,
          companyId: vanguard.id,
          tags: ['FOLLOW-UP'],
          folderId: f3.id
        }
      ]
    });
  }

  console.log('Saved Leads seeded.');

  // === Seed Saved Searches ===
  console.log('Seeding Saved Searches...');
  const existingSearches = await prisma.savedSearch.count();
  if (existingSearches === 0 && user?.clerkId) {
    await prisma.savedSearch.createMany({
      data: [
        {
          userId: user.clerkId,
          name: '⭐ Software Agencies Malaysia',
          query: { industry: 'Software Agencies', country: 'Malaysia' }
        },
        {
          userId: user.clerkId,
          name: '⭐ AI Startups Singapore',
          query: { industry: 'AI Startups', country: 'Singapore' }
        },
        {
          userId: user.clerkId,
          name: '⭐ Restaurants Dubai',
          query: { industry: 'Restaurants', country: 'United Arab Emirates', city: 'Dubai' }
        },
        {
          userId: user.clerkId,
          name: '⭐ Healthcare USA',
          query: { industry: 'Healthcare', country: 'United States' }
        },
        {
          userId: user.clerkId,
          name: '⭐ Law Firms London',
          query: { industry: 'Law Firms', country: 'United Kingdom', city: 'London' }
        }
      ]
    });
    console.log('Saved Searches seeded.');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
