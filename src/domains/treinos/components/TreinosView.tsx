"use client";

import { Dumbbell, ListChecks } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { useTreinos } from "../hooks/useTreinos";
import { ExercicioTable } from "./ExercicioTable";
import { FichaCard } from "./FichaCard";

/** Tela raiz de /treinos: biblioteca de exercícios + fichas de treino. */
export function TreinosView() {
  const { data, loading, error } = useTreinos();

  const exercicios = data?.exercicios ?? [];
  const fichas = data?.fichas ?? [];

  return (
    <div>
      <PageHeader
        title="Treinos"
        subtitle="Biblioteca de exercícios e fichas prescritas por objetivo · Unidade Centro"
      />

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar os treinos"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 font-display text-lg uppercase tracking-wide text-text-strong">
              <Dumbbell size={18} className="text-primary" /> Biblioteca de exercícios
            </h2>
            <Card flush>
              <div className="p-4">
                <ExercicioTable exercicios={exercicios} />
              </div>
            </Card>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 font-display text-lg uppercase tracking-wide text-text-strong">
              <ListChecks size={18} className="text-primary" /> Fichas de treino
            </h2>
            {fichas.length === 0 ? (
              <EmptyState
                title="Nenhuma ficha cadastrada"
                description="As fichas prescritas pelos professores aparecem aqui."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {fichas.map((ficha) => (
                  <FichaCard key={ficha.id} ficha={ficha} exercicios={exercicios} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-72 animate-pulse rounded-card border border-border bg-card-alt" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
    </div>
  );
}
