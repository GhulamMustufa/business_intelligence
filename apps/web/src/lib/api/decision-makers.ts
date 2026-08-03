import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchDecisionMakers(searchParams?: URLSearchParams) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  const query = searchParams ? `?${searchParams.toString()}` : '';

  const response = await fetch(`${API_URL}/decision-makers${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch decision makers');
  }

  return response.json();
}

export async function fetchDecisionMaker(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(`${API_URL}/decision-makers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch decision maker');
  }

  return response.json();
}
