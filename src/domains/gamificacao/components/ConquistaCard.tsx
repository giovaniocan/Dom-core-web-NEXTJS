import { Badge } from "@/shared/ui/Badge";
import type { Conquista } from "../types";
import { resolveConquistaIcon } from "./conquista-icons";

/** Card de uma conquista/badge: ícone (lucide por nome), título, descrição e critério. */
export function ConquistaCard({ conquista }: { conquista: Conquista }) {
  const Icon = resolveConquistaIcon(conquista.icone);

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon size={20} />
        </span>
        <h4 className="font-body text-base font-semibold text-text-strong">{conquista.titulo}</h4>
      </div>

      <p className="font-body text-sm text-text-muted">{conquista.descricao}</p>

      <div className="mt-auto pt-1">
        <Badge tone="neutral">
          <span className="font-body text-[11px]">{conquista.criterio}</span>
        </Badge>
      </div>
    </div>
  );
}
