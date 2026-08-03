import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { EnrichmentService } from './enrichment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, AiModule, DiscoveryModule, ConfigModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, EnrichmentService]
})
export class CompaniesModule {}
