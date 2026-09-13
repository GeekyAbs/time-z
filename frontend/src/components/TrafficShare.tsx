import { PieChart } from '@mui/x-charts';

import { Legend } from './Legend';
import { TONES, percent } from '../lib/format';
import type { BucketRow } from '../types';

interface TrafficShareProps {
  rows: BucketRow[];
  pages: readonly string[];
}

export function TrafficShare({ rows, pages }: TrafficShareProps) {
  const total = rows.reduce((s, r) => s + r.total, 0);

  const items = pages
    .map((page, i) => {
      const value = rows.reduce((s, r) => s + (r.counts[page] ?? 0), 0);
      return {
        id: page,
        label: page,
        value,
        color: TONES[i % TONES.length] ?? TONES[0],
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="chart">
      <div className="chart__plot chart__plot--pie">
        <PieChart
          height={240}
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          series={[
            {
              data: items,
              innerRadius: '64%',
              outerRadius: '88%',
              cornerRadius: 3,
              paddingAngle: 2,
              highlightScope: { fade: 'global', highlight: 'item' },
              cx: '50%',
              cy: '50%',
            },
          ]}
          hideLegend
        />
        <div className="pie-center" aria-hidden="true">
          <span className="pie-center__value">{total}</span>
          <span className="pie-center__label">hits</span>
        </div>
      </div>
      <Legend items={items.map((it) => ({ label: it.label, color: it.color, value: percent(it.value, total) + '%' }))} />
    </div>
  );
}