"use client";

import { useEffect, useState } from "react";
import { getAlunoDetalhe } from "../services/alunos-service";
import type { AlunoDetalhe } from "../types";

interface UseAlunoDetalheState {
  data: AlunoDetalhe | null;
  loading: boolean;
  error: string | null;
}

/** Carrega a ficha 360 de um aluno (aluno + relações) reagindo ao id. */
export function useAlunoDetalhe(id: string): UseAlunoDetalheState {
  const [state, setState] = useState<UseAlunoDetalheState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: null });

    getAlunoDetalhe(id)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar aluno.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
