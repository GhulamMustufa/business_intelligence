import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchCompanyProfile(companyId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(`${API_URL}/companies/${companyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', // Always fresh for profile data
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch company profile');
  }

  return response.json();
}
