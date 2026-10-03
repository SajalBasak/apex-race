import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}

export function Panel({
  children,
  title,
  eyebrow,
  action,
  className = "",
}: PanelProps) {
  return (
    <section
      className={[
        "rounded-[var(--radius-panel)]",
        "border border-[var(--border)]",
        "bg-[var(--surface-1)]",
        "shadow-[var(--shadow-panel)]",
        className,
      ].join(" ")}
    >
      {(title || eyebrow || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {eyebrow}
              </div>
            )}

            {title && (
              <h2 className="truncate text-sm font-semibold tracking-wide text-[var(--text-primary)]">
                {title}
              </h2>
            )}
          </div>

          {action}
        </header>
      )}

      <div>{children}</div>
    </section>
  );
}