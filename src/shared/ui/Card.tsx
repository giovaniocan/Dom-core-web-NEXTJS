import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Título opcional exibido no topo do card. */
  title?: ReactNode;
  /** Ação opcional alinhada à direita do título (ex: link "ver todos"). */
  action?: ReactNode;
  /** Remove o padding interno (útil para tabelas full-bleed). */
  flush?: boolean;
}

export function Card({ title, action, flush, className, children, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-card shadow-sm",
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          {title && (
            <h3 className="font-body text-sm font-semibold text-text-strong">{title}</h3>
          )}
          {action}
        </header>
      )}
      <div className={cn(!flush && "p-5")}>{children}</div>
    </section>
  );
}
