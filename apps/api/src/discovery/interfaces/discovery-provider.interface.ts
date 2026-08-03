export interface DiscoveredBusiness {
  name: string;
  industry: string;
  location: string;
  website?: string;
  phone?: string;
  rating?: number;
  description?: string;
  sourceId?: string;
}

export interface IDiscoveryProvider {
  searchBusinesses(query?: string, locations?: string[], industries?: string[]): Promise<DiscoveredBusiness[]>;
}
