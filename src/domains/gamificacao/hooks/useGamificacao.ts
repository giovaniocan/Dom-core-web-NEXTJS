"use client";

import { useEffect, useState } from "react";
import { getGamificacaoData } from "../services/gamificacao-service";
import type { GamificacaoData } from "../types";

interface UseGamificacaoState {
  data: GamificacaoData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega ranking, recompensas, conquistas e regras para /gamificacao, expondo loading/error. */
export function useGamificacao(): UseGamificacaoState {
  const [state, setState] = useState<UseGamificacaoState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getGamificacaoData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar a gamificação.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
