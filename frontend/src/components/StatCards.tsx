import { Gauge, SparkLineChart } from '@mui/x-charts';

import { ACCENT, TONES, percent } from '../lib/format';

interface StatCardsProps {
  eventsInWindow: number;
  eventsPerMin: number;
  activePages: number;
  totalPages: number;
  topPage: string;
  topPageCount: number;
  trend: number[];
  pages: readonly string[];
}

export function StatCards({
  eventsInWindow,
  eventsPerMin,
  activePages,
  totalPages,
  topPage,
  topPageCount,
  trend,
  pages,
}: StatCardsProps) {
  const gaugeMax = Math.max(60, Math.ceil((eventsPerMin * 1.4) / 10) * 10);

  return (
    <div className="stats">
      <article className="stat">
        <span className="stat__label">events · window</span>
        <span className="stat__value">{eventsInWindow}</span>
        <div className="stat__spark">
          <SparkLineChart
            data={trend}
            plotType="line"
            height={42}
            margin={{ top: 4, bottom: 4, left: 2, right: 2 }}
            color={ACCENT}
            sx={{
              '& .MuiLineElement-root': { stroke: ACCENT, strokeWidth: 1.8 },
            }}
          />
        </div>
      </article>

      <article className="stat">
        <span className="stat__label">throughput · events/min</span>
        <span className="stat__value">{eventsPerMin}</span>
        <div className="stat__gauge">
          <Gauge
            value={eventsPerMin}
            valueMin={0}
            valueMax={gaugeMax}
            startAngle={-110}
            endAngle={110}
            width={92}
            height={92}
            cornerRadius={4}
            text={() => null}
            sx={{
              '& .MuiGauge-valueArc': { fill: ACCENT },
              '& .MuiGauge-referenceArc': { fill: 'rgba(236,232,227,0.08)' },
            }}
          />
        </div>
      </article>

      <article className="stat">
        <span className="stat__label">active routes</span>
        <span className="stat__value">
          {activePages}
          <span className="stat__unit">/{totalPages}</span>
        </span>
        <ul className="stat__dots" aria-label="Active routes">
          {pages.map((p, i) => (
            <li
              key={p}
              className="stat__dot"
              title={p}
              style={{
                background:
                  i < activePages ? TONES[i % TONES.length]! : 'rgba(236,232,227,0.10)',
              }}
            />
          ))}
        </ul>
      </article>

      <article className="stat">
        <span className="stat__label">top route</span>
        <span className="stat__value stat__value--route">{topPage}</span>
        <span className="stat__sub">
          {topPageCount > 0 ? `${topPageCount} hits · ${percent(topPageCount, eventsInWindow)}% of window` : 'no traffic yet'}
        </span>
      </article>
    </div>
  );
}