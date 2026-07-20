"use client";

import { useEffect, useState } from "react";
import { getRelatoriosData } from "../services/relatorios-service";
import type { RelatoriosData } from "../types";

interface UseRelatoriosState {
  data: RelatoriosData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega as coleções da tela /relatorios, expondo loading/error. */
export function useRelatorios(): UseRelatoriosState {
  const [state, setState] = useState<UseRelatoriosState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getRelatoriosData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar os relatórios.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
