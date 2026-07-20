"use client";

import { useEffect, useState } from "react";
import { getDietaData } from "../services/dieta-service";
import type { DietaData } from "../types";

interface UseDietaState {
  data: DietaData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega planos alimentares + alunos + profissionais para /dieta, expondo loading/error. */
export function useDieta(): UseDietaState {
  const [state, setState] = useState<UseDietaState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getDietaData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar a dieta.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
