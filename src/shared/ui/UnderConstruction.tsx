import { Construction, Sparkles } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Badge } from "./Badge";

export interface UnderConstructionProps {
  title: string;
  description: string;
  /** Funcionalidades planejadas para o módulo. */
  features: string[];
}

/** Placeholder visível para módulos ainda não implementados (status "em-construcao"). */
export function UnderConstruction({ title, description, features }: UnderConstructionProps) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={description}
        actions={<Badge tone="warning">Em construção</Badge>}
      />

      <div className="rounded-card border border-dashed border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Construction size={24} />
          </span>
          <div>
            <p className="font-display text-xl uppercase tracking-wide text-text-strong">
              Módulo em desenvolvimento
            </p>
            <p className="font-body text-sm text-text-muted">
              Esta área faz parte do roadmap do DomCore Web.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wide text-text-faint">
            Funcionalidades planejadas
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 rounded-lg border border-border bg-card-alt px-3 py-2 font-body text-sm text-text-strong"
              >
                <Sparkles size={15} className="text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
