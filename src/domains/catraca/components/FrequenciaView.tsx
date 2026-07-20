"use client";

import { useMemo } from "react";
import { CalendarClock, Clock, Flame, UserX } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { StatTile } from "@/shared/ui/StatTile";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useCatraca } from "../hooks/useCatraca";
import {
  alunosSumidos,
  buildHeatmap,
  frequencyByAluno,
  latestTimestamp,
  peakHour,
} from "../services/catraca-service";
import { CatracaTabs } from "./catracaTabs";
import { PeakHeatmap } from "./PeakHeatmap";
import { FrequencyTable } from "./FrequencyTable";
import { MissingStudents } from "./MissingStudents";
import type { CatracaData } from "../types";

/** Deriva os agregados de frequência a partir dos dados brutos. */
function useFrequencia(data: CatracaData) {
  return useMemo(() => {
    const frequencias = frequencyByAluno(data.acessos, data.alunos);
    const totalEntradas = frequencias.reduce((sum, f) => sum + f.entradas, 0);
    const ref = latestTimestamp(data.acessos) ?? new Date().toISOString();
    return {
      frequencias,
      totalEntradas,
      heatmap: buildHeatmap(data.acessos),
      pico: peakHour(data.acessos),
      sumidos: alunosSumidos(data.alunos, ref),
    };
  }, [data]);
}

/** Frequência: por aluno, heatmap de horários de pico e alunos sumidos. */
export function FrequenciaView() {
  const { data, loading, error } = useCatraca();

  return (
    <div>
      <PageHeader title="Frequência" subtitle="Entradas por aluno, horários de pico e ausências">
        <CatracaTabs active="frequencia" />
      </PageHeader>

      {loading && <SkeletonFreq />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar a frequência"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && <FrequenciaPanel data={data} />}
    </div>
  );
}

function FrequenciaPanel({ data }: { data: CatracaData }) {
  const { frequencias, totalEntradas, heatmap, pico, sumidos } = useFrequencia(data);
  const picoLabel = pico ? `${pico.hora}h` : "—";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="Entradas no período"
          value={totalEntradas}
          icon={<CalendarClock size={18} />}
          hint="passagens liberadas"
        />
        <StatTile
          label="Alunos frequentando"
          value={frequencias.length}
          icon={<Flame size={18} />}
          hint="com ao menos 1 entrada"
        />
        <StatTile
          label="Horário de pico"
          value={picoLabel}
          icon={<Clock size={18} />}
          hint={pico ? `${pico.total} entradas nesse horário` : "sem dados"}
        />
        <StatTile
          label="Alunos sumidos"
          value={sumidos.length}
          icon={<UserX size={18} />}
          accentClassName={sumidos.length > 0 ? "text-danger" : undefined}
          hint="sem visita recente"
        />
      </div>

      <PeakHeatmap heatmap={heatmap} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FrequencyTable frequencias={frequencias} />
        </div>
        <MissingStudents sumidos={sumidos} />
      </div>
    </div>
  );
}

function SkeletonFreq() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-card border border-border bg-card-alt" />
    </div>
  );
}
