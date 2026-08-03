import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { DiscoveryModule } from '../discovery/discovery.module';

@Module({
  imports: [PrismaModule, AiModule, DiscoveryModule],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
