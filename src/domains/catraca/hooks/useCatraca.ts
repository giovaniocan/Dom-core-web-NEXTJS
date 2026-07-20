"use client";

import { useEffect, useState } from "react";
import { loadCatracaData } from "../services/catraca-service";
import type { CatracaData } from "../types";

interface UseCatracaState {
  data: CatracaData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega acessos + alunos + unidades uma vez, expondo loading/error. */
export function useCatraca(): UseCatracaState {
  const [state, setState] = useState<UseCatracaState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    loadCatracaData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar dados da catraca.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
