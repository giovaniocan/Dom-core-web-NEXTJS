import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Ações à direita (botões, filtros). */
  actions?: ReactNode;
  /** Elemento abaixo do título (ex: <Tabs/>). */
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, actions, children }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text-strong">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 font-body text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}
