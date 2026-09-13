export interface EventBucket {
  bucket: string;
  page: string;
  count: number;
}

export const PAGES = ['/', '/pricing', '/blog', '/docs', '/about', '/contact', '/careers'] as const;

export const PAGE_WEIGHTS = [30, 20, 18, 15, 10, 5, 2];

export interface BucketRow {
  ts: string;
  counts: Record<string, number>;
  total: number;
}

export type BucketDuration = '10 seconds' | '30 seconds' | '1 minute';