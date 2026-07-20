"use client";

import { useEffect, useState } from "react";
import { getInadimplenciaData } from "../services/financeiro-service";
import type { InadimplenciaData } from "../types";

interface UseInadimplenciaState {
  data: InadimplenciaData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega faturas vencidas + alunos para a tela de inadimplência. */
export function useInadimplencia(): UseInadimplenciaState {
  const [state, setState] = useState<UseInadimplenciaState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getInadimplenciaData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar a inadimplência.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
