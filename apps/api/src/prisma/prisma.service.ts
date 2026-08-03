import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // If not defined, fallback to the hardcoded env so it runs
    const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_aP81EFWdcRiu@ep-noisy-surf-az8rnbp0-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
