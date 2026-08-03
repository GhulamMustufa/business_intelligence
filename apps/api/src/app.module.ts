import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CompaniesModule } from './companies/companies.module';
import { DecisionMakersModule } from './decision-makers/decision-makers.module';
import { SavedLeadsModule } from './saved-leads/saved-leads.module';
import { AiModule } from './ai/ai.module';
import { OutreachModule } from './outreach/outreach.module';
import { FoldersModule } from './folders/folders.module';
import { BillingModule } from './billing/billing.module';
import { SavedSearchesModule } from './saved-searches/saved-searches.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    AuthModule, 
    CompaniesModule, 
    DecisionMakersModule, 
    SavedLeadsModule, 
    AiModule, 
    OutreachModule, 
    FoldersModule, 
    BillingModule, 
    SavedSearchesModule, 
    DashboardModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
