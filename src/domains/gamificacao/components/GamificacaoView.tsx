"use client";

import { useMemo, useState } from "react";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Tabs } from "@/shared/ui/Tabs";
import { useGamificacao } from "../hooks/useGamificacao";
import { ordenarRanking, podium } from "../services/gamificacao-service";
import { RankingPodium } from "./RankingPodium";
import { RankingTable } from "./RankingTable";
import { RecompensaCard } from "./RecompensaCard";
import { ConquistaCard } from "./ConquistaCard";
import { RegrasPanel } from "./RegrasPanel";

type TabKey = "ranking" | "recompensas" | "conquistas" | "regras";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ranking", label: "Ranking" },
  { key: "recompensas", label: "Recompensas" },
  { key: "conquistas", label: "Conquistas" },
  { key: "regras", label: "Regras" },
];

/** Tela raiz de /gamificacao: ranking, recompensas, conquistas e regras de XP. */
export function GamificacaoView() {
  const { data, loading, error } = useGamificacao();
  const [tab, setTab] = useState<TabKey>("ranking");

  const ranking = data?.ranking ?? [];
  const ordenado = useMemo(() => ordenarRanking(ranking), [ranking]);
  const top3 = useMemo(() => podium(ranking), [ranking]);

  return (
    <div>
      <PageHeader
        title="Gamificação"
        subtitle="XP, foguinhos, ranking e recompensas · Unidade Centro"
      >
        <Tabs items={TABS} activeKey={tab} onChange={(k) => setTab(k as TabKey)} />
      </PageHeader>

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar a gamificação"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        <div className="space-y-4">
          {tab === "ranking" && (
            <>
              <RankingPodium top3={top3} />
              <Card flush title="Ranking geral">
                <RankingTable ranking={ordenado} />
              </Card>
            </>
          )}

          {tab === "recompensas" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.recompensas.map((recompensa) => (
                <RecompensaCard key={recompensa.id} recompensa={recompensa} />
              ))}
            </div>
          )}

          {tab === "conquistas" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.conquistas.map((conquista) => (
                <ConquistaCard key={conquista.id} conquista={conquista} />
              ))}
            </div>
          )}

          {tab === "regras" && <RegrasPanel config={data.config} />}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-48 animate-pulse rounded-card border border-border bg-card-alt" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
    </div>
  );
}
