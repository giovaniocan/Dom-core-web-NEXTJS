"use client";

import { useEffect, useState } from "react";
import { getProfissionaisData } from "../services/profissionais-service";
import type { ProfissionaisData } from "../types";

interface UseProfissionaisState {
  data: ProfissionaisData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega equipe + fichas + alunos para a tela /profissionais, expondo loading/error. */
export function useProfissionais(): UseProfissionaisState {
  const [state, setState] = useState<UseProfissionaisState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getProfissionaisData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar os profissionais.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
