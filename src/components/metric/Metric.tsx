import type { ReactNode } from "react";

interface MetricProps {
  label: string;
  value: ReactNode;
  unit?: string;
  accent?: boolean;
  className?: string;
}

export function Metric({
  label,
  value,
  unit,
  accent = false,
  className = "",
}: MetricProps) {
  return (
    <div className={className}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </div>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span
          className={[
            "font-mono text-xl font-semibold tabular-nums",
            accent
              ? "text-[var(--accent)]"
              : "text-[var(--text-primary)]",
          ].join(" ")}
        >
          {value}
        </span>

        {unit && (
          <span className="text-[10px] font-medium uppercase text-[var(--text-muted)]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}