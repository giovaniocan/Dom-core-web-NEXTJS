"use client";

import { useEffect, useState } from "react";
import { getFinanceiroData } from "../services/financeiro-service";
import type { FinanceiroData } from "../types";

interface UseFinanceiroState {
  data: FinanceiroData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega faturas + planos para a tela /financeiro, expondo loading/error. */
export function useFinanceiro(): UseFinanceiroState {
  const [state, setState] = useState<UseFinanceiroState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getFinanceiroData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar o financeiro.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
