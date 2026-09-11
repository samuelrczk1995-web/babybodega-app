import type { ReactNode } from "react";

export function Badge({ children, tone = "sage" }: { children: ReactNode; tone?: "sage" | "amber" | "ink" }) {
  const styles: Record<string, string> = {
    sage: "bg-sage text-ink",
    amber: "bg-amber text-ink",
    ink: "bg-ink text-cream",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}
