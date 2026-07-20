import { cn } from "@/shared/lib/cn";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

/** Extrai até 2 iniciais do nome. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-body font-semibold",
    SIZES[size],
    className,
  );

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={cn(base, "object-cover")} />;
  }

  return (
    <span className={cn(base, "bg-primary/15 text-primary")} aria-label={name}>
      {initials(name)}
    </span>
  );
}
