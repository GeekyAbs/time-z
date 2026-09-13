import { useEffect, useState } from 'react';

import type { BucketDuration } from '../types';
import { formatTime } from '../lib/format';

const DURATIONS: BucketDuration[] = ['10 seconds', '30 seconds', '1 minute'];

const DURATION_LABEL: Record<BucketDuration, string> = {
  '10 seconds': '10s',
  '30 seconds': '30s',
  '1 minute': '1m',
};

interface HeaderProps {
  isHealthy: boolean;
  isSimulating: boolean;
  duration: BucketDuration;
  onDurationChange: (d: BucketDuration) => void;
  onSimulate: () => void;
}

function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Header({ isHealthy, isSimulating, duration, onDurationChange, onSimulate }: HeaderProps) {
  const now = useClock();
  const utc = `${formatTime(now.toISOString())} UTC`;

  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">
          <img src="/favicon.svg" alt="" width={28} height={28} />
        </span>
        <span className="header__name">ChronoFlow</span>
        <span className="header__tag">time-series traffic console</span>
      </div>

      <div className="header__tools">
        <span className={`status ${isHealthy ? 'status--ok' : 'status--down'}`}>
          <span className="status__dot" />
          {isHealthy ? 'api online' : 'api offline'}
        </span>

        <span className="live">
          <span className="live__dot" />
          LIVE
        </span>

        <div className="chips" role="group" aria-label="Bucket granularity">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={`chip ${d === duration ? 'chip--active' : ''}`}
              onClick={() => onDurationChange(d)}
              aria-pressed={d === duration}
            >
              {DURATION_LABEL[d]}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn--primary"
          disabled={isSimulating || !isHealthy}
          onClick={onSimulate}
        >
          {isSimulating ? 'simulating…' : '\u25B6 simulate traffic'}
        </button>

        <span className="header__clock">{utc}</span>
      </div>
    </header>
  );
}