"use client";

import { useMemo } from "react";
import { DoorOpen, Gauge, ShieldX, Users } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { StatTile } from "@/shared/ui/StatTile";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useCatraca } from "../hooks/useCatraca";
import {
  buildTerminals,
  computePresence,
  contagemDoDia,
  occupancyByUnidade,
  ocupacaoPct,
  recentPasses,
} from "../services/catraca-service";
import { CatracaTabs } from "./catracaTabs";
import { LivePresence } from "./LivePresence";
import { AccessFeed } from "./AccessFeed";
import { OccupancyBoard } from "./OccupancyBoard";
import { TerminalStatus } from "./TerminalStatus";
import type { CatracaData } from "../types";

const FEED_LIMIT = 12;

/** Deriva todo o painel ao vivo a partir dos dados brutos (sem side effects). */
function useLivePanel(data: CatracaData) {
  return useMemo(() => {
    const presentes = computePresence(data.acessos);
    const capacidadeTotal = data.unidades.reduce((sum, u) => sum + u.capacidade, 0);
    const contagem = contagemDoDia(data.acessos);
    return {
      presentes,
      terminais: buildTerminals(data.acessos),
      ocupacao: occupancyByUnidade(presentes, data.unidades),
      feed: recentPasses(data.acessos, FEED_LIMIT),
      contagem,
      ocupacaoTotal: ocupacaoPct(presentes.length, capacidadeTotal),
    };
  }, [data]);
}

/** Painel AO VIVO da catraca: quem está agora, ocupação, feed e status dos terminais. */
export function CatracaView() {
  const { data, loading, error } = useCatraca();

  return (
    <div>
      <PageHeader title="Catraca" subtitle="Acesso em tempo real · DomCore Gym - PR">
        <CatracaTabs active="ao-vivo" />
      </PageHeader>

      {loading && <SkeletonPanel />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar a catraca"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && <LivePanel data={data} />}
    </div>
  );
}

function LivePanel({ data }: { data: CatracaData }) {
  const { presentes, terminais, ocupacao, feed, contagem, ocupacaoTotal } = useLivePanel(data);
  const terminaisOnline = terminais.filter((t) => t.online).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="Na academia agora"
          value={presentes.length}
          icon={<Users size={18} />}
          hint="alunos dentro"
        />
        <StatTile
          label="Ocupação"
          value={`${ocupacaoTotal}%`}
          icon={<Gauge size={18} />}
          hint="da capacidade total"
        />
        <StatTile
          label="Liberados hoje"
          value={contagem.liberados}
          icon={<DoorOpen size={18} />}
          accentClassName="text-success"
          hint="passagens autorizadas"
        />
        <StatTile
          label="Negados hoje"
          value={contagem.negados}
          icon={<ShieldX size={18} />}
          accentClassName={contagem.negados > 0 ? "text-danger" : undefined}
          hint={`${terminaisOnline}/${terminais.length} catracas online`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <LivePresence presentes={presentes} />
          <OccupancyBoard ocupacao={ocupacao} />
          <TerminalStatus terminais={terminais} />
        </div>
        <AccessFeed passes={feed} />
      </div>
    </div>
  );
}

function SkeletonPanel() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-card border border-border bg-card-alt" />
    </div>
  );
}
