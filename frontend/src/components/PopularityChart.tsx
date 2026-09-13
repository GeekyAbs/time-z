import { BarChart } from '@mui/x-charts';

import { ACCENT } from '../lib/format';
import type { BucketRow } from '../types';

interface PopularityChartProps {
  rows: BucketRow[];
  pages: readonly string[];
}

const AXIS_FONT = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: 11,
  fill: '#a8a29a',
};

export function PopularityChart({ rows, pages }: PopularityChartProps) {
  const entries = pages
    .map((page) => ({
      page,
      total: rows.reduce((s, r) => s + (r.counts[page] ?? 0), 0),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="chart chart--fill">
      <BarChart
        height={294}
        layout="horizontal"
        margin={{ top: 8, right: 24, bottom: 24, left: 70 }}
        xAxis={[
          {
            tickLabelStyle: { ...AXIS_FONT, fontVariantNumeric: 'tabular-nums' },
            classes: { tickLabel: 'axis-label', line: 'axis-line' },
          },
        ]}
        yAxis={[
          {
            scaleType: 'band',
            data: entries.map((e) => e.page),
            tickLabelStyle: AXIS_FONT,
            classes: { tickLabel: 'axis-label', line: 'axis-line' },
          },
        ]}
        grid={{ vertical: true, horizontal: false }}
        series={[{ data: entries.map((e) => e.total), color: ACCENT }]}
        hideLegend
        sx={{
          '& .MuiBarElement-root': { fillOpacity: 0.85, rx: 2 },
        }}
      />
      <p className="chart__foot">route hits · rollup over the live window</p>
    </div>
  );
}