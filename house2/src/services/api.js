const API_URL = import.meta.env.VITE_API_URL || 'https://vaload-api.onrender.com';

export async function fetchAnalyze(region, name, tag) {
  const res = await fetch(`${API_URL}/api/v1/analyze/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch analysis (${res.status})`);
  }
  return res.json();
}
export async function submitFeedback(message, name) {
  const res = await fetch(`${API_URL}/api/v1/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, name: name || null }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to submit feedback (${res.status})`);
  }
  return res.json();
}
