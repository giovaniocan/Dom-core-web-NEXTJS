"use client";

import { useEffect, useState } from "react";
import { getTreinosData } from "../services/treinos-service";
import type { TreinosData } from "../types";

interface UseTreinosState {
  data: TreinosData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega exercícios + fichas para a tela /treinos, expondo loading/error. */
export function useTreinos(): UseTreinosState {
  const [state, setState] = useState<UseTreinosState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getTreinosData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar os treinos.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
