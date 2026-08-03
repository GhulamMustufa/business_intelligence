import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const res = await prisma.company.deleteMany({ where: { website: 'https://example.com' } });
  console.log(`Deleted ${res.count} items.`);
  await app.close();
}
bootstrap();
