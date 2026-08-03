import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AiService } from './src/ai/ai.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const aiService = app.get(AiService);

  const company = await prisma.company.findFirst();
  if (!company) {
    console.log("No companies found.");
    await app.close();
    return;
  }
  
  console.log(`Generating insight for company ${company.id} (${company.name})`);
  try {
    const res = await aiService.generateCompanyInsights(company.id);
    console.log("Success:", res);
  } catch (err) {
    console.error("Error generating insight:", err);
  }
  await app.close();
}
bootstrap();
