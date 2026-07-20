"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Tabs } from "@/shared/ui/Tabs";
import { useProfissionais } from "../hooks/useProfissionais";
import { alunosDoProfissional, papeisDisponiveis } from "../services/profissionais-service";
import type { Profissional } from "../types";
import { CarteiraAlunos } from "./CarteiraAlunos";
import { ProfissionalCard } from "./ProfissionalCard";

const TODOS = "todos";

/** Tela raiz de /profissionais: grade de cards com filtro por papel + carteira de alunos. */
export function ProfissionaisView() {
  const { data, loading, error } = useProfissionais();
  const [papel, setPapel] = useState<string>(TODOS);
  const [selecionado, setSelecionado] = useState<Profissional | null>(null);

  const profissionais = data?.profissionais ?? [];
  const fichas = data?.fichas ?? [];
  const alunos = data?.alunos ?? [];

  const filtros = useMemo(
    () => [
      { key: TODOS, label: "Todos" },
      ...papeisDisponiveis(profissionais).map((p) => ({ key: p, label: p })),
    ],
    [profissionais],
  );

  const filtrados = useMemo(
    () => (papel === TODOS ? profissionais : profissionais.filter((p) => p.papel === papel)),
    [profissionais, papel],
  );

  const carteira = useMemo(
    () => (selecionado ? alunosDoProfissional(selecionado, fichas, alunos) : []),
    [selecionado, fichas, alunos],
  );

  return (
    <div>
      <PageHeader
        title="Profissionais"
        subtitle="Equipe da academia · personais, nutricionistas e carteira de alunos"
      >
        {!loading && !error && profissionais.length > 0 && (
          <Tabs items={filtros} activeKey={papel} onChange={setPapel} />
        )}
      </PageHeader>

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar os profissionais"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        filtrados.length === 0 ? (
          <EmptyState
            title="Nenhum profissional encontrado"
            description="Ajuste o filtro de papel para ver a equipe."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((prof) => (
              <ProfissionalCard key={prof.id} profissional={prof} onClick={setSelecionado} />
            ))}
          </div>
        )
      )}

      <CarteiraAlunos
        profissional={selecionado}
        alunos={carteira}
        onClose={() => setSelecionado(null)}
      />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-card border border-border bg-card-alt" />
      ))}
    </div>
  );
}
