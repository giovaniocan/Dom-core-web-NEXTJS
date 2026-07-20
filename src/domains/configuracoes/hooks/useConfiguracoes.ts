"use client";

import { useEffect, useState } from "react";
import { getConfiguracoesData } from "../services/configuracoes-service";
import type { ConfiguracoesData } from "../types";

interface UseConfiguracoesState {
  data: ConfiguracoesData | null;
  loading: boolean;
  error: string | null;
}

/** Carrega academia, unidades, usuários, planos e integrações para /configuracoes. */
export function useConfiguracoes(): UseConfiguracoesState {
  const [state, setState] = useState<UseConfiguracoesState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getConfiguracoesData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message =
            err instanceof Error ? err.message : "Erro ao carregar as configurações.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
