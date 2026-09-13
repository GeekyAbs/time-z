import { formatTime, tickAgo } from '../lib/format';
import { TONES } from '../lib/format';
import type { BucketRow } from '../types';

interface EventFeedProps {
  rows: BucketRow[];
  pages: readonly string[];
}

export function EventFeed({ rows, pages }: EventFeedProps) {
  const feed = rows
    .slice()
    .reverse()
    .flatMap((row) => {
      const pageTotals = pages
        .map((page, i) => ({
          page,
          count: row.counts[page] ?? 0,
          color: TONES[i % TONES.length] ?? TONES[0],
        }))
        .filter((p) => p.count > 0);
      if (pageTotals.length === 0) return [];
      return pageTotals.map((p) => ({
        ts: row.ts,
        ...p,
      }));
    })
    .slice(0, 44);

  return (
    <ol className="feed" aria-label="Recent bucket activity">
      {feed.length === 0 && (
        <li className="feed__empty">
          <span className="feed__led" />
          waiting for events — hit <em>simulate traffic</em>
        </li>
      )}
      {feed.map((entry, i) => (
        <li className={`feed__row ${i === 0 ? 'feed__row--fresh' : ''}`} key={`${entry.ts}-${entry.page}`}>
          <span className="feed__time" data-live={i === 0 ? 'true' : undefined}>
            {formatTime(entry.ts)}
          </span>
          <span className="feed__page">
            <span className="feed__swatch" style={{ background: entry.color }} />
            {entry.page}
          </span>
          <span className="feed__count">+{entry.count}</span>
          {i === 0 && <span className="feed__ago">{tickAgo(entry.ts)}</span>}
        </li>
      ))}
    </ol>
  );
}