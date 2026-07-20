import { Dumbbell, Flame, Milestone, TrendingUp } from "lucide-react";
import { StatTile } from "@/shared/ui/StatTile";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import type { GamificacaoConfig } from "../types";

/** Exibição somente-leitura das regras de gamificação (config atual). */
export function RegrasPanel({ config }: { config: GamificacaoConfig }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          label="XP por treino"
          value={config.xpPorTreino.toLocaleString("pt-BR")}
          icon={<Dumbbell size={18} />}
          hint="pontos creditados a cada treino concluído"
        />
        <StatTile
          label="Foguinhos por treino"
          value={config.foguinhosPorTreino.toLocaleString("pt-BR")}
          icon={<Flame size={18} />}
          hint="incremento do streak diário"
        />
        <StatTile
          label="Bônus de streak"
          value={`+${config.bonusStreak}%`}
          icon={<TrendingUp size={18} />}
          hint="multiplicador ao manter a sequência"
        />
      </div>

      <Card
        title={
          <span className="inline-flex items-center gap-2">
            <Milestone size={16} className="text-primary" />
            Marcos de streak (dias)
          </span>
        }
      >
        <div className="flex flex-wrap gap-2">
          {config.marcos.map((marco) => (
            <Badge key={marco} tone="primary">
              {marco} dias
            </Badge>
          ))}
        </div>
        <p className="mt-4 font-body text-xs text-text-faint">
          Catálogo de resgate {config.catalogoResgatavel ? "ativo" : "desativado"} · configuração
          somente-leitura nesta demo.
        </p>
      </Card>
    </div>
  );
}
