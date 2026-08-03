import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SerpApiProvider } from './providers/serpapi.provider';
import { MockProvider } from './providers/mock.provider';
import { GosomScraperProvider } from './providers/gosom-scraper.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [
    {
      provide: 'DISCOVERY_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const useGosom = configService.get<string>('USE_GOSOM_SCRAPER');
        if (useGosom === 'true') {
          return new GosomScraperProvider();
        }
        
        const serpApiKey = configService.get<string>('SERPAPI_KEY');
        if (serpApiKey) {
          return new SerpApiProvider();
        }
        return new MockProvider();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DISCOVERY_PROVIDER'],
})
export class DiscoveryModule {}
