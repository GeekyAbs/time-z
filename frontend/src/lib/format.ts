export const ACCENT = '#ff7a1a';

export const TONES = [
  '#ff7a1a',
  '#ffb01e',
  '#ff5a4e',
  '#ffd43b',
  '#ff8f33',
  '#ff7043',
  '#ffcf5c',
];

const pad = (n: number) => String(n).padStart(2, '0');

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatShortClock(iso: string): string {
  return formatTime(iso).slice(0, 5);
}

export function percent(part: number, total: number): string {
  if (total <= 0) return '0.0';
  return ((part / total) * 100).toFixed(1);
}

export function tickAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s ago`;
}