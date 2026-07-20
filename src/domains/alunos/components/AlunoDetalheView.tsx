"use client";

import { useState } from "react";
import { Tabs, type TabItem } from "@/shared/ui/Tabs";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useAlunoDetalhe } from "../hooks/useAlunoDetalhe";
import { AlunoHeader } from "./AlunoHeader";
import { ResumoTab } from "./ResumoTab";
import { FinanceiroTab } from "./FinanceiroTab";
import { TreinoTab } from "./TreinoTab";
import { DietaTab } from "./DietaTab";
import { AcessosTab } from "./AcessosTab";
import { GamificacaoTab } from "./GamificacaoTab";

const TABS: TabItem[] = [
  { key: "resumo", label: "Resumo" },
  { key: "financeiro", label: "Financeiro" },
  { key: "treino", label: "Treino" },
  { key: "dieta", label: "Dieta" },
  { key: "acessos", label: "Acessos" },
  { key: "gamificacao", label: "Gamificação" },
];

export interface AlunoDetalheViewProps {
  id: string;
}

/** Ficha 360 do aluno. A page do App Router apenas repassa o id da rota. */
export function AlunoDetalheView({ id }: AlunoDetalheViewProps) {
  const { data, loading, error } = useAlunoDetalhe(id);
  const [tab, setTab] = useState("resumo");

  if (loading) return <DetalheSkeleton />;

  if (error || !data) {
    return (
      <EmptyState
        title="Não foi possível carregar o aluno"
        description={`${error ?? "Aluno não encontrado."} Verifique se o json-server está no ar (npm run mock).`}
      />
    );
  }

  return (
    <div>
      <AlunoHeader aluno={data.aluno} />
      <Tabs items={TABS} activeKey={tab} onChange={setTab} />

      <div className="mt-5">
        {tab === "resumo" && <ResumoTab detalhe={data} />}
        {tab === "financeiro" && <FinanceiroTab faturas={data.faturas} />}
        {tab === "treino" && <TreinoTab fichas={data.fichas} exercicios={data.exercicios} />}
        {tab === "dieta" && <DietaTab aluno={data.aluno} />}
        {tab === "acessos" && <AcessosTab acessos={data.acessos} />}
        {tab === "gamificacao" && <GamificacaoTab aluno={data.aluno} ranking={data.ranking} />}
      </div>
    </div>
  );
}

function DetalheSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="h-28 animate-pulse rounded-card border border-border bg-card-alt" />
      <div className="h-9 w-full max-w-md animate-pulse rounded-lg bg-card-alt" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
    </div>
  );
}
