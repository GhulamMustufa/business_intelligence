const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createFolder(name: string, token: string) {
  const response = await fetch(`${API_URL}/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to create folder');
  }

  return response.json();
}
