import { cn } from "@/shared/lib/cn";

export type ProgressTone = "primary" | "success" | "danger" | "warning";

export interface ProgressBarProps {
  /** 0 a 100. */
  value: number;
  tone?: ProgressTone;
  showLabel?: boolean;
  className?: string;
}

const TONE_BG: Record<ProgressTone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
};

export function ProgressBar({
  value,
  tone = "primary",
  showLabel,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-card-alt"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-all", TONE_BG[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 text-right font-body text-xs font-semibold text-text-muted">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
