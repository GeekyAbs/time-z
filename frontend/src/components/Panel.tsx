import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  meta?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, meta, subtitle, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__head">
        <h2 className="panel__title">{title}</h2>
        {subtitle && <span className="panel__subtitle">{subtitle}</span>}
        {meta && <span className="panel__meta">{meta}</span>}
      </header>
      {children}
    </section>
  );
}