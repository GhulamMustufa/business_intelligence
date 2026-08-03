import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchOutreachDraft(decisionMakerId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(`${API_URL}/outreach/${decisionMakerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch outreach draft');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
