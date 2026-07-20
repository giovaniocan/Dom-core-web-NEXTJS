import { Crown, Flame, Medal } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { cn } from "@/shared/lib/cn";
import type { RankingEntry } from "../types";

interface PodiumSlot {
  entry: RankingEntry;
  rank: number;
}

/** Ordem visual do pódio por rank: 2º à esquerda, 1º ao centro (mais alto), 3º à direita. */
const VISUAL_ORDER = [2, 1, 3] as const;

const PODIUM_HEIGHT: Record<number, string> = {
  1: "h-28",
  2: "h-20",
  3: "h-16",
};

function PodiumBlock({ entry, rank }: PodiumSlot) {
  const destaque = rank === 1;

  return (
    <div className="flex flex-1 flex-col items-center justify-end gap-2">
      <div className="relative">
        <Avatar name={entry.nome} size={destaque ? "lg" : "md"} />
        <span
          className={cn(
            "absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card",
            destaque ? "text-primary" : "text-text-muted",
          )}
        >
          {destaque ? <Crown size={14} /> : <Medal size={14} />}
        </span>
      </div>

      <div className="text-center">
        <p
          className={cn(
            "font-body text-sm font-semibold",
            destaque ? "text-text-strong" : "text-text-muted",
          )}
        >
          {entry.nome}
        </p>
        <p className="font-display text-xl tracking-wide text-text-strong">
          {entry.xp.toLocaleString("pt-BR")}
          <span className="ml-1 font-body text-xs text-text-faint">XP</span>
        </p>
        <p className="inline-flex items-center gap-1 font-body text-xs text-text-muted">
          <Flame size={12} className="text-primary" />
          {entry.streak} dias
        </p>
      </div>

      <div
        className={cn(
          "flex w-full items-start justify-center rounded-card border border-border pt-2 font-display text-2xl tracking-wide",
          destaque ? "bg-warning/20 text-text-strong" : "bg-card-alt text-text-muted",
          PODIUM_HEIGHT[rank] ?? "h-16",
        )}
      >
        {rank}º
      </div>
    </div>
  );
}

/** Pódio visual dos 3 primeiros colocados do ranking (por XP). */
export function RankingPodium({ top3 }: { top3: RankingEntry[] }) {
  if (top3.length === 0) {
    return (
      <div className="rounded-card border border-border bg-card p-8 text-center font-body text-sm text-text-faint">
        Nenhum aluno no ranking ainda.
      </div>
    );
  }

  const byRank = new Map<number, PodiumSlot>(
    top3.map((entry, index) => [index + 1, { entry, rank: index + 1 }]),
  );
  const ordered = VISUAL_ORDER.map((rank) => byRank.get(rank)).filter(
    (slot): slot is PodiumSlot => Boolean(slot),
  );

  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Crown size={18} className="text-primary" />
        <h3 className="font-body text-sm font-semibold text-text-strong">Pódio da temporada</h3>
      </div>
      <div className="flex items-end justify-center gap-4">
        {ordered.map(({ entry, rank }) => (
          <PodiumBlock key={entry.id} entry={entry} rank={rank} />
        ))}
      </div>
    </div>
  );
}
