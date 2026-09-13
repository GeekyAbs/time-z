import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { checkHealth, fetchEventBuckets, simulateTraffic } from '../../src/api';
import { PAGES } from '../../src/types';
import type { BucketDuration, BucketRow, EventBucket } from '../../src/types';

const POLL_INTERVAL_MS = 4000;
const WINDOW_SECONDS = 360;

const BUCKET_SECONDS: Record<BucketDuration, number> = {
  '10 seconds': 10,
  '30 seconds': 30,
  '1 minute': 60,
};

const bucketMs = (duration: BucketDuration) => BUCKET_SECONDS[duration] * 1000;

function align(date: Date, ms: number): number {
  return Math.floor(date.getTime() / ms) * ms;
}

export interface Feed {
  rows: BucketRow[];
  pages: readonly string[];
  eventsInWindow: number;
  eventsPerMin: number;
  bucketSizeSeconds: number;
  topPage: string;
  topPageCount: number;
  activePages: number;
  isHealthy: boolean;
  lastUpdated: Date | null;
  isSimulating: boolean;
  simulate: (count?: number) => Promise<void>;
}

export function useEventFeed(duration: BucketDuration): Feed {
  const [rows, setRows] = useState<BucketRow[]>([]);
  const [isHealthy, setIsHealthy] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const ms = bucketMs(duration);

  const poll = useCallback(async () => {
    try {
      const since = new Date(Date.now() - WINDOW_SECONDS * 1000).toISOString();
      const buckets: EventBucket[] = await fetchEventBuckets(duration, since, PAGES);
      if (!mounted.current) return;

      const byTs = new Map<number, Record<string, number>>();
      for (const b of buckets) {
        const key = align(new Date(b.bucket), ms);
        if (!byTs.has(key)) byTs.set(key, {});
        byTs.get(key)![b.page] = b.count;
      }

      if (byTs.size > 0) {
        const keys = [...byTs.keys()].sort((a, b) => a - b);
        const start = keys[0];
        const end = keys[keys.length - 1];
        const filled: BucketRow[] = [];
        for (let t = start; t <= end; t += ms) {
          const counts = byTs.get(t) ?? {};
          const total = Object.values(counts).reduce((s, c) => s + c, 0);
          filled.push({
            ts: new Date(t).toISOString(),
            counts: { ...counts },
            total,
          });
        }
        const maxLen = Math.ceil(WINDOW_SECONDS / BUCKET_SECONDS[duration]);
        setRows(filled.slice(-maxLen));
      }
      setLastUpdated(new Date());
    } catch {
      if (mounted.current) setIsHealthy(false);
    }
  }, [duration, ms]);

  useEffect(() => {
    const first = setTimeout(poll, 0);
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [poll]);

  const healthPing = useCallback(async () => {
    if (mounted.current) setIsHealthy(await checkHealth());
  }, []);

  useEffect(() => {
    const id = setInterval(healthPing, 8000);
    return () => clearInterval(id);
  }, [healthPing]);

  const stats = useMemo(() => {
    let eventsInWindow = 0;
    const pageTotals: Record<string, number> = {};
    for (const r of rows) {
      eventsInWindow += r.total;
      for (const [page, count] of Object.entries(r.counts)) {
        pageTotals[page] = (pageTotals[page] ?? 0) + count;
      }
    }
    const entries = Object.entries(pageTotals).sort((a, b) => b[1] - a[1]);
    const top = entries[0];
    const activePages = entries.filter(([, c]) => c > 0).length;
    const windowMinutes = Math.max(WINDOW_SECONDS / 60, 0.01);
    return {
      eventsInWindow,
      eventsPerMin: Math.round(eventsInWindow / windowMinutes),
      topPage: top?.[0] ?? '—',
      topPageCount: top?.[1] ?? 0,
      activePages,
    };
  }, [rows]);

  const handleSimulate = useCallback(async (count = 24) => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      await simulateTraffic(count);
      await poll();
    } finally {
      if (mounted.current) setIsSimulating(false);
    }
  }, [isSimulating, poll]);

  return {
    rows,
    pages: PAGES,
    bucketSizeSeconds: BUCKET_SECONDS[duration],
    isHealthy,
    lastUpdated,
    isSimulating,
    simulate: handleSimulate,
    ...stats,
  };
}