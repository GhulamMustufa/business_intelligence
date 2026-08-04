const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function bulkMoveLeads(leadIds: string[], folderId: string | null, token: string) {
  const response = await fetch(`${API_URL}/saved-leads/bulk-move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ leadIds, folderId }),
  });

  if (!response.ok) {
    throw new Error('Failed to bulk move leads');
  }

  return response.json();
}

export async function exportLeads(searchParams: URLSearchParams, token: string) {
  const response = await fetch(`${API_URL}/saved-leads/export?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export leads');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'bizradar_export.csv';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
