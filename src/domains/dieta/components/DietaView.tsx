"use client";

import { useMemo, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { cn } from "@/shared/lib/cn";
import { useDieta } from "../hooks/useDieta";
import { adesao, somaMacros } from "../services/dieta-service";
import type { AlunoResumo, PlanoAlimentar, ProfissionalResumo } from "../types";
import { AdesaoChart } from "./AdesaoChart";
import { MacroResumo } from "./MacroResumo";
import { RefeicaoCard } from "./RefeicaoCard";

/** Tela raiz de /dieta: seleciona um plano e mostra macros, adesão e refeições. */
export function DietaView() {
  const { data, loading, error } = useDieta();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const planos = data?.planos ?? [];
  const alunosById = useMemo(
    () => new Map((data?.alunos ?? []).map((a) => [a.id, a])),
    [data],
  );
  const profsById = useMemo(
    () => new Map((data?.profissionais ?? []).map((p) => [p.id, p])),
    [data],
  );

  const selected = planos.find((p) => p.id === (selectedId ?? planos[0]?.id)) ?? null;

  return (
    <div>
      <PageHeader
        title="Dieta"
        subtitle="Planos alimentares, metas de macros e adesão às refeições"
      />

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar a dieta"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && planos.length === 0 && (
        <EmptyState
          title="Nenhum plano alimentar cadastrado"
          description="Cadastre um plano para acompanhar metas e refeições."
        />
      )}

      {data && !loading && selected && (
        <div className="space-y-4">
          <AlunoSelector
            planos={planos}
            alunosById={alunosById}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />
          <PlanoDetalhe plano={selected} nutri={profsById.get(selected.nutriId) ?? null} />
        </div>
      )}
    </div>
  );
}

function AlunoSelector({
  planos,
  alunosById,
  selectedId,
  onSelect,
}: {
  planos: PlanoAlimentar[];
  alunosById: Map<string, AlunoResumo>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card flush title="Alunos com plano">
      <div className="flex gap-2 overflow-x-auto p-3">
        {planos.map((plano) => {
          const aluno = alunosById.get(plano.alunoId);
          const nome = aluno?.nome ?? plano.alunoId;
          const isActive = plano.id === selectedId;
          return (
            <button
              key={plano.id}
              type="button"
              onClick={() => onSelect(plano.id)}
              aria-pressed={isActive}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-card border px-3 py-2 text-left transition-colors",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-card-alt",
              )}
            >
              <Avatar name={nome} src={aluno?.foto} size="sm" />
              <span
                className={cn(
                  "font-body text-sm font-medium",
                  isActive ? "text-text-strong" : "text-text-muted",
                )}
              >
                {nome}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function PlanoDetalhe({
  plano,
  nutri,
}: {
  plano: PlanoAlimentar;
  nutri: ProfissionalResumo | null;
}) {
  const soma = useMemo(() => somaMacros(plano.refeicoes), [plano]);
  const ad = useMemo(() => adesao(plano.refeicoes), [plano]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Metas de macros" className="lg:col-span-2">
          <MacroResumo metas={plano.metas} soma={soma} />
        </Card>
        <Card title="Adesão do dia">
          <div className="flex h-full items-center justify-center py-2">
            <AdesaoChart adesao={ad} />
          </div>
        </Card>
      </div>

      {nutri && (
        <p className="font-body text-xs text-text-faint">
          Plano acompanhado por{" "}
          <span className="font-semibold text-text-muted">{nutri.nome}</span> (nutricionista).
        </p>
      )}

      {plano.notaNutri && (
        <Card title="Nota da nutricionista">
          <p className="font-body text-sm text-text-muted">{plano.notaNutri}</p>
        </Card>
      )}

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-text-strong">
          <UtensilsCrossed size={16} className="text-primary" />
          Refeições do dia
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plano.refeicoes.map((refeicao) => (
            <RefeicaoCard key={`${refeicao.nome}-${refeicao.horario}`} refeicao={refeicao} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-16 animate-pulse rounded-card border border-border bg-card-alt" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-card border border-border bg-card-alt lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-card border border-border bg-card-alt" />
      </div>
    </div>
  );
}
