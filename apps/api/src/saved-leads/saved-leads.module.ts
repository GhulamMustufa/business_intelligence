import { Module } from '@nestjs/common';
import { SavedLeadsController } from './saved-leads.controller';
import { SavedLeadsService } from './saved-leads.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SavedLeadsController],
  providers: [SavedLeadsService]
})
export class SavedLeadsModule {}
