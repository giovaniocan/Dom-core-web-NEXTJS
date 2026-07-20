import { Flame, Trophy } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { Avatar } from "@/shared/ui/Avatar";
import { cn } from "@/shared/lib/cn";
import type { RankingEntry } from "../types";

const MEDAL_COLOR: Record<number, string> = {
  1: "text-gold",
  2: "text-silver",
  3: "text-bronze",
};

export function EngagementRanking({ ranking }: { ranking: RankingEntry[] }) {
  return (
    <Card
      title="Ranking de engajamento"
      action={<Trophy size={16} className="text-gold" />}
    >
      <ul className="space-y-1">
        {ranking.map((entry) => (
          <li
            key={entry.alunoId}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-card-alt"
          >
            <span
              className={cn(
                "w-6 text-center font-display text-xl",
                MEDAL_COLOR[entry.posicao] ?? "text-text-faint",
              )}
            >
              {entry.posicao}
            </span>
            <Avatar name={entry.nome} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-body text-sm font-semibold text-text-strong">
                {entry.nome}
              </p>
              <p className="font-body text-xs text-text-muted">{entry.xp} XP</p>
            </div>
            <span className="flex items-center gap-1 font-body text-sm font-semibold text-primary">
              <Flame size={14} />
              {entry.streak}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
