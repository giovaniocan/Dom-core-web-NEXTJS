import { AlertTriangle, RefreshCw, Cake, ClipboardCheck, type LucideIcon } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import type { Pendencia, PendenciaTipo } from "../types";

const ICONS: Record<PendenciaTipo, LucideIcon> = {
  inadimplencia: AlertTriangle,
  renovacao: RefreshCw,
  aniversario: Cake,
  avaliacao: ClipboardCheck,
};

export function PendingTasks({ pendencias }: { pendencias: Pendencia[] }) {
  return (
    <Card title="Pendências">
      <ul className="space-y-2">
        {pendencias.map((p) => {
          const Icon = ICONS[p.tipo];
          return (
            <li
              key={p.tipo}
              className="flex items-center gap-3 rounded-lg border border-border bg-card-alt px-3 py-2.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon size={16} />
              </span>
              <span className="flex-1 font-body text-sm text-text-strong">{p.titulo}</span>
              <Badge tone={p.tipo === "inadimplencia" ? "danger" : "primary"}>
                {p.quantidade}
              </Badge>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
