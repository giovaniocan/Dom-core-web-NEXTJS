import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="text-text-faint">{icon ?? <Inbox size={40} strokeWidth={1.5} />}</span>
      <div>
        <p className="font-body text-base font-semibold text-text-strong">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm font-body text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
