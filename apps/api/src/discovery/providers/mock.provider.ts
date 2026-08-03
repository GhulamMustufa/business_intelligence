import { Injectable } from '@nestjs/common';
import { IDiscoveryProvider, DiscoveredBusiness } from '../interfaces/discovery-provider.interface';

@Injectable()
export class MockProvider implements IDiscoveryProvider {
  async searchBusinesses(query?: string, locations?: string[], industries?: string[]): Promise<DiscoveredBusiness[]> {
    // For the mock provider, we just return an empty array.
    // The core CompaniesService will still query the local Prisma DB after this.
    return [];
  }
}
