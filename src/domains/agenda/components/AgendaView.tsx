"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, Flame, Percent, Users } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Tabs } from "@/shared/ui/Tabs";
import { StatTile } from "@/shared/ui/StatTile";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useAgenda } from "../hooks/useAgenda";
import { weekStats } from "../services/agenda-service";
import { WeeklyGrid } from "./WeeklyGrid";
import { ClassDetailModal } from "./ClassDetailModal";
import type { Aula } from "../types";

const TODAS = "todas";

/** Componente raiz do domínio Agenda. A page do App Router apenas o renderiza. */
export function AgendaView() {
  const { aulas, unidades, alunos, loading, error } = useAgenda();
  const [unidadeId, setUnidadeId] = useState<string>(TODAS);
  const [selected, setSelected] = useState<Aula | null>(null);

  const filtradas = useMemo(
    () => (unidadeId === TODAS ? aulas : aulas.filter((a) => a.unidadeId === unidadeId)),
    [aulas, unidadeId],
  );

  const stats = useMemo(() => weekStats(filtradas), [filtradas]);

  const tabs = useMemo(
    () => [{ key: TODAS, label: "Todas" }, ...unidades.map((u) => ({ key: u.id, label: u.nome }))],
    [unidades],
  );

  const unidadeNome = selected
    ? unidades.find((u) => u.id === selected.unidadeId)?.nome
    : undefined;

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle="Grade semanal de aulas coletivas · modalidade, professor e ocupação"
      >
        {!loading && !error && tabs.length > 1 && (
          <Tabs items={tabs} activeKey={unidadeId} onChange={setUnidadeId} />
        )}
      </PageHeader>

      {loading && <SkeletonAgenda />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar a agenda"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatTile
              label="Aulas na semana"
              value={stats.totalAulas}
              icon={<CalendarCheck size={18} />}
            />
            <StatTile
              label="Ocupação média"
              value={`${stats.ocupacaoMedia}%`}
              icon={<Percent size={18} />}
            />
            <StatTile
              label="Turmas lotadas"
              value={stats.lotadas}
              hint="sem vagas"
              icon={<Flame size={18} />}
              accentClassName={stats.lotadas > 0 ? "text-danger" : undefined}
            />
            <StatTile
              label="Vagas abertas"
              value={stats.vagasAbertas}
              icon={<Users size={18} />}
              accentClassName="text-success"
            />
          </div>

          <WeeklyGrid aulas={filtradas} onSelect={setSelected} />
        </div>
      )}

      <ClassDetailModal
        aula={selected}
        alunos={alunos}
        unidadeNome={unidadeNome}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function SkeletonAgenda() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-card border border-border bg-card-alt" />
    </div>
  );
}
