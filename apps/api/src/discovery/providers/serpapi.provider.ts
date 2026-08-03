import { Injectable, Logger } from '@nestjs/common';
import { IDiscoveryProvider, DiscoveredBusiness } from '../interfaces/discovery-provider.interface';

@Injectable()
export class SerpApiProvider implements IDiscoveryProvider {
  private readonly logger = new Logger(SerpApiProvider.name);
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.SERPAPI_KEY || '';
    if (!this.apiKey) {
      this.logger.warn('SERPAPI_KEY is not defined in environment variables. Live searches will fail.');
    }
  }

  async searchBusinesses(query?: string, locations?: string[], industries?: string[]): Promise<DiscoveredBusiness[]> {
    if (!this.apiKey) return [];

    try {
      // Build a natural language query for Google Maps, e.g., "Software Companies in Austin"
      let searchQuery = query || '';
      if (industries && industries.length > 0) {
        searchQuery += ` ${industries.join(' ')}`;
      }
      if (locations && locations.length > 0) {
        searchQuery += ` in ${locations.join(', ')}`;
      }

      if (!searchQuery.trim()) {
        return [];
      }

      this.logger.log(`Calling SerpApi with query: "${searchQuery.trim()}"`);

      const params = new URLSearchParams({
        engine: 'google_local',
        q: searchQuery.trim(),
        api_key: this.apiKey,
        num: '20' // fetch up to 20 results
      });

      const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
      
      if (!response.ok) {
        this.logger.error(`SerpApi responded with status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      if (!data.local_results || !Array.isArray(data.local_results)) {
        return [];
      }

      // Map SerpApi results to our standard interface
      const results: DiscoveredBusiness[] = data.local_results.map((item: any) => ({
        name: item.title,
        industry: item.type || (industries ? industries[0] : 'Unknown'),
        location: item.address || (locations ? locations[0] : 'Unknown'),
        website: item.links?.website || item.website,
        phone: item.phone,
        rating: item.rating,
        description: item.description,
        sourceId: item.place_id
      }));

      return results;

    } catch (error) {
      this.logger.error('Error fetching data from SerpApi', error);
      return [];
    }
  }
}
