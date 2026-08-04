import { Module } from '@nestjs/common';
import { DecisionMakersController } from './decision-makers.controller';
import { DecisionMakersService } from './decision-makers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [DecisionMakersController],
  providers: [DecisionMakersService],
  exports: [DecisionMakersService]
})
export class DecisionMakersModule {}
