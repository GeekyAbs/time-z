import { PAGE_WEIGHTS, PAGES } from './types';
import type { EventBucket } from './types';

export async function fetchEventBuckets(
  duration: string,
  since?: string,
  pages: readonly string[] = [],
): Promise<EventBucket[]> {
  const params = new URLSearchParams({ duration });
  if (since) params.set('since', since);
  for (const p of pages) params.append('pages', p);
  const res = await fetch(`/api/events/?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`GET /api/events/ failed: ${res.status}`);
  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch('/healthz');
    return res.ok;
  } catch {
    return false;
  }
}

export async function simulateTraffic(count = 24): Promise<number> {
  const totalWeight = PAGE_WEIGHTS.reduce((s, w) => s + w, 0);
  let sent = 0;
  for (let i = 0; i < count; i++) {
let roll = Math.random() * totalWeight;
  let page: (typeof PAGES)[number] = PAGES[0];
    for (let j = 0; j < PAGE_WEIGHTS.length; j++) {
      const w = PAGE_WEIGHTS[j] ?? 0;
      if (roll <= w) {
        page = PAGES[j];
        break;
      }
      roll -= w;
    }
    const res = await fetch('/api/events/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, description: '' }),
    });
    if (res.status === 201 || res.ok) sent += 1;
  }
  return sent;
}