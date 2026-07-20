"use client";

import { useEffect, useState } from "react";
import { getAulas, getUnidades, getAlunosLite } from "../services/agenda-service";
import type { Aula, AlunoLite, Unidade } from "../types";

interface UseAgendaState {
  aulas: Aula[];
  unidades: Unidade[];
  alunos: AlunoLite[];
  loading: boolean;
  error: string | null;
}

const INITIAL: UseAgendaState = {
  aulas: [],
  unidades: [],
  alunos: [],
  loading: true,
  error: null,
};

/**
 * Carrega, em paralelo, aulas + unidades + alunos (para o roster).
 * A filtragem por unidade acontece no cliente (grade única, sem refetch).
 */
export function useAgenda(): UseAgendaState {
  const [state, setState] = useState<UseAgendaState>(INITIAL);

  useEffect(() => {
    let active = true;

    Promise.all([getAulas(), getUnidades(), getAlunosLite()])
      .then(([aulas, unidades, alunos]) => {
        if (active) setState({ aulas, unidades, alunos, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Erro ao carregar a agenda.";
        setState({ ...INITIAL, loading: false, error: message });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
