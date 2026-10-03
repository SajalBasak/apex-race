import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );
}