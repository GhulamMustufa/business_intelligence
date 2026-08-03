import { fetchCompanies } from '@/lib/api/discovery';
import DiscoveryLayout from '@/components/discovery/DiscoveryLayout';

import { Suspense } from 'react';
import DiscoveryLoading from './loading';

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const params = await searchParams;
  const searchKey = new URLSearchParams(params as any).toString();

  return (
    <Suspense key={searchKey} fallback={<DiscoveryLoading />}>
      <DiscoveryDataFetcher params={params} />
    </Suspense>
  );
}

async function DiscoveryDataFetcher({ params }: { params: Record<string, string | string[]> }) {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlParams.append(key, v));
    } else if (value) {
      urlParams.append(key, value);
    }
  });
  
  // Explicitly ask the backend for up to 100 results so we can paginate them locally
  if (!urlParams.has('limit')) {
    urlParams.append('limit', '100');
  }

  let initialCompanies = [];
  let initialTotal = 0;

  try {
    const data = await fetchCompanies(urlParams);
    initialCompanies = data.items || [];
    initialTotal = data.total || 0;
  } catch (error) {
    console.error('Failed to fetch initial companies:', error);
  }

  return (
    <DiscoveryLayout 
      initialCompanies={initialCompanies}
      initialTotal={initialTotal}
    />
  );
}

