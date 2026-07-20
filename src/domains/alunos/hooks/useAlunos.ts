"use client";

import { useEffect, useState } from "react";
import { getAlunos } from "../services/alunos-service";
import type { Aluno } from "../types";

interface UseAlunosState {
  data: Aluno[];
  loading: boolean;
  error: string | null;
}

/** Carrega a lista de alunos uma vez, expondo loading/error. */
export function useAlunos(): UseAlunosState {
  const [state, setState] = useState<UseAlunosState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getAlunos()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar alunos.";
          setState({ data: [], loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
