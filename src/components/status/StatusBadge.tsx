import type { ReactNode } from "react";

type Status =
  | "live"
  | "info"
  | "success"
  | "warning"
  | "critical";

interface StatusBadgeProps {
  status: Status;
  children: ReactNode;
}

const statusClasses: Record<Status, string> = {
  live: "bg-[var(--accent-soft)] text-[var(--accent)]",
  info: "bg-[rgba(110,200,255,0.1)] text-[var(--info)]",
  success: "bg-[rgba(112,225,138,0.1)] text-[var(--success)]",
  warning: "bg-[rgba(255,200,87,0.1)] text-[var(--warning)]",
  critical: "bg-[rgba(255,93,93,0.1)] text-[var(--critical)]",
};

export function StatusBadge({
  status,
  children,
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full px-2 py-1",
        "text-[10px] font-bold text-green-500 uppercase tracking-[0.12em]",
        statusClasses[status],
      ].join(" ")}
    >
      {status === "live" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}

      {children}
    </span>
  );
}