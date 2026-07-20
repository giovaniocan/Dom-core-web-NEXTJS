"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCheck, AlertTriangle, Lock } from "lucide-react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { StatTile } from "@/shared/ui/StatTile";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useAlunos } from "../hooks/useAlunos";
import { contarPorStatus, filterAlunos, planoOptions } from "../services/alunos-service";
import type { Aluno, AlunosFilter } from "../types";
import { AlunosFilters } from "./AlunosFilters";
import { AlunosTable } from "./AlunosTable";

const INITIAL_FILTER: AlunosFilter = { search: "", status: "todos", plano: "todos" };

/** Componente raiz do domínio Alunos (listagem/CRM). A page do App Router apenas o renderiza. */
export function AlunosView() {
  const router = useRouter();
  const { data, loading, error } = useAlunos();
  const [filter, setFilter] = useState<AlunosFilter>(INITIAL_FILTER);

  const planos = useMemo(() => planoOptions(data), [data]);
  const contagem = useMemo(() => contarPorStatus(data), [data]);
  const filtrados = useMemo(() => filterAlunos(data, filter), [data, filter]);

  function abrirFicha(aluno: Aluno) {
    router.push(`/alunos/${aluno.id}`);
  }

  return (
    <div>
      <PageHeader
        title="Alunos"
        subtitle="Base de alunos da DomCore Gym · Unidade Centro"
      />

      {loading && <SkeletonList />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar os alunos"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label="Total" value={contagem.total} icon={<Users size={18} />} />
            <StatTile
              label="Ativos"
              value={contagem.ativo}
              icon={<UserCheck size={18} />}
              accentClassName="text-success"
            />
            <StatTile
              label="Inadimplentes"
              value={contagem.inadimplente}
              icon={<AlertTriangle size={18} />}
              accentClassName="text-danger"
            />
            <StatTile
              label="Trancados"
              value={contagem.trancado}
              icon={<Lock size={18} />}
              accentClassName="text-warning"
            />
          </div>

          <Card flush>
            <div className="border-b border-border p-4">
              <AlunosFilters filter={filter} planos={planos} onChange={setFilter} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="font-body text-xs text-text-muted">
                <span className="font-display text-sm text-text-strong">{filtrados.length}</span>{" "}
                {filtrados.length === 1 ? "aluno" : "alunos"}
              </span>
            </div>
            <AlunosTable alunos={filtrados} onSelect={abrirFicha} />
          </Card>
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-card border border-border bg-card-alt" />
    </div>
  );
}
