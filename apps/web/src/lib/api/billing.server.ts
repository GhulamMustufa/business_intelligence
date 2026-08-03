import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchBilling() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(`${API_URL}/billing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch billing info');
  }

  return response.json();
}
