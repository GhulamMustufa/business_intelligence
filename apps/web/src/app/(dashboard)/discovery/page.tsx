import { fetchCompanies } from '@/lib/api/discovery';
import DiscoveryLayout from '@/components/discovery/DiscoveryLayout';

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  // In Next.js 15, searchParams is a Promise
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlParams.append(key, v));
    } else if (value) {
      urlParams.append(key, value);
    }
  });

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
