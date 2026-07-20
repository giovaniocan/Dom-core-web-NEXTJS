import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type BadgeTone = "neutral" | "primary" | "success" | "danger" | "warning" | "info";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-card-alt text-text-muted",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
  info: "bg-silver/20 text-text-muted",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-body text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
