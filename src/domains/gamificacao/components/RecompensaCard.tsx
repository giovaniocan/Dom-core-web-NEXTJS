import { Gift, Package, Sparkles } from "lucide-react";
import { Badge, type BadgeTone } from "@/shared/ui/Badge";
import type { Recompensa } from "../types";

interface CategoriaMeta {
  label: string;
  tone: BadgeTone;
}

const CATEGORIA_META: Record<string, CategoriaMeta> = {
  produto: { label: "Produto", tone: "primary" },
  beneficio: { label: "Benefício", tone: "success" },
  servico: { label: "Serviço", tone: "info" },
};

function categoriaMeta(categoria: string): CategoriaMeta {
  return CATEGORIA_META[categoria] ?? { label: categoria, tone: "neutral" };
}

/** Card de uma recompensa resgatável: nome, custo em XP, estoque e categoria. */
export function RecompensaCard({ recompensa }: { recompensa: Recompensa }) {
  const meta = categoriaMeta(recompensa.categoria);
  const semEstoque = recompensa.estoque <= 0;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-card bg-primary/15 text-primary">
          <Gift size={18} />
        </span>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      <h4 className="font-body text-base font-semibold text-text-strong">{recompensa.nome}</h4>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-wide text-text-faint">
            <Sparkles size={12} className="text-primary" />
            Custo
          </p>
          <p className="font-display text-2xl tracking-wide text-text-strong">
            {recompensa.custo_xp.toLocaleString("pt-BR")}
            <span className="ml-1 font-body text-xs text-text-faint">XP</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 font-body text-xs text-text-muted">
          <Package size={12} />
          {semEstoque ? "Esgotado" : `${recompensa.estoque} em estoque`}
        </span>
      </div>
    </div>
  );
}
