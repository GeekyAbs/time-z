import { LineChart } from '@mui/x-charts';

import { Legend } from './Legend';
import { ACCENT, formatTime } from '../lib/format';
import type { BucketRow } from '../types';

interface LiveTrafficChartProps {
  rows: BucketRow[];
  bucketSizeSeconds: number;
}

const AXIS_FONT = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: 11,
  fill: '#a8a29a',
};

export function LiveTrafficChart({ rows, bucketSizeSeconds }: LiveTrafficChartProps) {
  const labels = rows.map((r) => formatTime(r.ts));
  const totals = rows.map((r) => r.total);
  const step = Math.max(1, Math.ceil(labels.length / 6));

  return (
    <div className="chart chart--fill">
      <div className="chart__legend-row">
        <Legend
          items={[
            { label: 'total events', color: ACCENT, value: `${totals.reduce((s, v) => s + v, 0)} in window` },
          ]}
        />
        <span className="chart__note">
          {bucketSizeSeconds}s buckets · animated append
        </span>
      </div>
      <div className="chart__plot hero">
        <LineChart
          height={320}
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
          series={[
            {
              label: 'total events',
              data: totals,
              area: true,
              curve: 'monotoneX',
              color: ACCENT,
              showMark: 'end',
            },
          ]}
          hideLegend
        />
      </div>
    </div>
  );
}