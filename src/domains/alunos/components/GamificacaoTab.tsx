import { Flame, Zap, Trophy, Medal, Lock } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { StatTile } from "@/shared/ui/StatTile";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { cn } from "@/shared/lib/cn";
import { conquistas, nivelFromXp, rankingPosicao } from "../services/alunos-service";
import type { Aluno, RankingEntry } from "../types";

const nf = new Intl.NumberFormat("pt-BR");

export interface GamificacaoTabProps {
  aluno: Aluno;
  ranking: RankingEntry[];
}

export function GamificacaoTab({ aluno, ranking }: GamificacaoTabProps) {
  const posicao = rankingPosicao(ranking, aluno.id);
  const nivel = nivelFromXp(aluno.xp);
  const medalhas = conquistas(aluno, posicao);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="XP total"
          value={nf.format(aluno.xp)}
          icon={<Zap size={18} />}
          hint={`Nível ${nivel.nivel}`}
        />
        <StatTile
          label="Ofensiva"
          value={aluno.streak}
          icon={<Flame size={18} />}
          accentClassName="text-primary"
          hint="dias seguidos"
        />
        <StatTile
          label="Ranking"
          value={posicao ? `#${posicao}` : "—"}
          icon={<Trophy size={18} />}
          accentClassName={posicao && posicao <= 3 ? "text-gold" : undefined}
          hint="unidade"
        />
      </div>

      <Card title={`Progresso · Nível ${nivel.nivel}`}>
        <div className="space-y-2">
          <ProgressBar value={nivel.pct} tone="primary" showLabel />
          <p className="font-body text-xs text-text-muted">
            <span className="font-display text-sm text-text-strong">
              {nf.format(nivel.xpNoNivel)}
            </span>{" "}
            / {nf.format(1000)} XP no nível · faltam{" "}
            <span className="font-semibold text-text-strong">
              {nf.format(nivel.xpParaProximo)}
            </span>{" "}
            XP para o nível {nivel.nivel + 1}
          </p>
        </div>
      </Card>

      <Card title="Conquistas">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {medalhas.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                m.earned
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card-alt opacity-60",
              )}
            >
              <span className={cn(m.earned ? "text-primary" : "text-text-faint")}>
                {m.earned ? <Medal size={20} /> : <Lock size={18} />}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-body text-sm font-semibold",
                    m.earned ? "text-text-strong" : "text-text-muted",
                  )}
                >
                  {m.label}
                </p>
                <p className="font-body text-xs text-text-faint">{m.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
