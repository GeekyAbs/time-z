interface LegendProps {
  items: { label: string; color: string; value?: string }[];
}

export function Legend({ items }: LegendProps) {
  return (
    <ul className="legend" aria-hidden="true">
      {items.map((item) => (
        <li className="legend__item" key={item.label}>
          <span className="legend__swatch" style={{ background: item.color }} />
          <span className="legend__label">{item.label}</span>
          {item.value && <span className="legend__value">{item.value}</span>}
        </li>
      ))}
    </ul>
  );
}