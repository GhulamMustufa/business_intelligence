import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EnrichmentResult {
  website?: string;
  logoUrl?: string;
  linkedInUrl?: string;
  snippet?: string;
}

@Injectable()
export class EnrichmentService {
  private readonly logger = new Logger(EnrichmentService.name);

  constructor(private configService: ConfigService) {}

  async enrichCompanyData(name: string, currentWebsite?: string): Promise<EnrichmentResult> {
    const result: EnrichmentResult = {};

    try {
      // 1. Clearbit Autocomplete for Domain and Logo
      const clearbitRes = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(name)}`);
      if (clearbitRes.ok) {
        const data = await clearbitRes.json();
        if (data && data.length > 0) {
          const bestMatch = data[0];
          // Prefer existing website if available, otherwise use Clearbit's domain
          result.website = currentWebsite || (bestMatch.domain ? `https://${bestMatch.domain}` : undefined);
          result.logoUrl = bestMatch.logo;
          this.logger.log(`Clearbit enrichment successful for ${name}`);
        }
      } else {
        this.logger.warn(`Clearbit API returned status ${clearbitRes.status} for ${name}`);
      }
    } catch (error) {
      this.logger.error(`Error fetching Clearbit data for ${name}:`, error);
    }

    try {
      // 2. Google Custom Search for LinkedIn and snippet
      const googleApiKey = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
      const googleSearchEngineId = this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID');

      if (googleApiKey && googleSearchEngineId) {
        const query = encodeURIComponent(`site:linkedin.com/company "${name}"`);
        const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleSearchEngineId}&q=${query}`;
        
        const googleRes = await fetch(url);
        if (googleRes.ok) {
          const searchData = await googleRes.json();
          if (searchData.items && searchData.items.length > 0) {
            const bestMatch = searchData.items[0];
            result.linkedInUrl = bestMatch.link;
            result.snippet = bestMatch.snippet;
            this.logger.log(`Google Custom Search enrichment successful for ${name}`);
          }
        } else {
          this.logger.warn(`Google Custom Search API returned status ${googleRes.status} for ${name}`);
        }
      } else {
         this.logger.warn(`Google Custom Search credentials missing, skipping LinkedIn enrichment for ${name}`);
      }
    } catch (error) {
      this.logger.error(`Error fetching Google Custom Search data for ${name}:`, error);
    }

    return result;
  }
}
