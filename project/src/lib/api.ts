const API_BASE = '/.netlify/functions';

export async function authenticatePin(pin: string) {
  const response = await fetch(`${API_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
    credentials: 'include',
  });
  return response.ok;
}

export async function fetchDatabases(notionToken: string) {
  const response = await fetch(`${API_BASE}/notion`, {
    headers: {
      'X-Notion-Token': notionToken,
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch databases');
  }
  
  return response.json();
}