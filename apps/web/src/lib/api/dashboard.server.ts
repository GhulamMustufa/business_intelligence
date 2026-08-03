import { getToken } from "@/app/actions/auth";

export interface DashboardMetrics {
  totalSavedLeads: number;
  totalPitches: number;
  totalFolders: number;
  creditsRemaining: number;
  recentSearches: { id: string, name: string, createdAt: string }[];
  recentLeads: {
    id: string;
    company: {
      id: string;
      name: string;
      industry: string;
    }
  }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const token = await getToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/dashboard/metrics`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    next: { revalidate: 0 } // Always fetch fresh data for dashboard
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch dashboard metrics: ${res.status} ${errorText}`);
  }

  return res.json();
}
