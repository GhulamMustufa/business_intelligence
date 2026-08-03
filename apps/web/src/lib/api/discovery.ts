import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchCompanies(searchParams: URLSearchParams) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const queryString = searchParams.toString();
  const url = `${API_URL}/companies${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Adding Next.js revalidate or cache rules if needed, but for search it's usually dynamic.
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }

  return response.json();
}

export async function fetchCompanyInsights(companyId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(`${API_URL}/companies/${companyId}/insights`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch company insights');
  }

  return response.json();
}
