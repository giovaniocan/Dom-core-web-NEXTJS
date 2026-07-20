import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type Trend = "up" | "down" | "flat";

export interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  delta?: { value: string; trend: Trend };
  /** Cor de destaque do valor (ex: "text-danger"). */
  accentClassName?: string;
}

const TREND_COLOR: Record<Trend, string> = {
  up: "text-success",
  down: "text-danger",
  flat: "text-text-faint",
};

export function StatTile({
  label,
  value,
  hint,
  icon,
  delta,
  accentClassName,
}: StatTileProps) {
  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="font-body text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span
          className={cn(
            "font-display text-4xl leading-none tracking-wide text-text-strong",
            accentClassName,
          )}
        >
          {value}
        </span>
        {delta && (
          <span className={cn("mb-0.5 font-body text-sm font-semibold", TREND_COLOR[delta.trend])}>
            {delta.value}
          </span>
        )}
      </div>

      {hint && <p className="mt-1 font-body text-xs text-text-faint">{hint}</p>}
    </div>
  );
}
