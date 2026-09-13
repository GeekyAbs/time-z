import { LineChart } from '@mui/x-charts';

import { Legend } from './Legend';
import { TONES, formatTime } from '../lib/format';
import type { BucketRow } from '../types';

interface PageBreakdownProps {
  rows: BucketRow[];
  pages: readonly string[];
}

const AXIS_FONT = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: 11,
  fill: '#a8a29a',
};

export function PageBreakdown({ rows, pages }: PageBreakdownProps) {
  const labels = rows.map((r) => formatTime(r.ts));
  const step = Math.max(1, Math.ceil(labels.length / 6));

  const series = pages.map((page, i) => ({
    label: page,
    data: rows.map((r) => r.counts[page] ?? 0),
    stack: 'traffic',
    area: true,
    curve: 'monotoneX' as const,
    color: TONES[i % TONES.length] ?? TONES[0],
  }));

  const pageTotals = pages
    .map((page, i) => ({
      page,
      total: rows.reduce((s, r) => s + (r.counts[page] ?? 0), 0),
      color: TONES[i % TONES.length] ?? TONES[0],
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="chart">
      <Legend items={pageTotals.map((p) => ({ label: p.page, color: p.color, value: String(p.total) }))} />
      <div className="chart__plot">
        <LineChart
          height={300}
          margin={{ top: 14, right: 16, bottom: 26, left: 44 }}
          grid={{ horizontal: true, vertical: false }}
          xAxis={[
            {
              scaleType: 'band',
              data: labels,
              tickInterval: (_, index) => index % step === 0,
              tickLabelStyle: AXIS_FONT,
              classes: { tickLabel: 'axis-label', line: 'axis-line' },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { ...AXIS_FONT, fontVariantNumeric: 'tabular-nums' },
              classes: { tickLabel: 'axis-label', line: 'axis-line' },
            },
          ]}
          series={series}
          hideLegend
        />
      </div>
    </div>
  );
}