"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard-service";
import type { DashboardSnapshot } from "../types";

interface UseDashboardState {
  data: DashboardSnapshot | null;
  loading: boolean;
  error: string | null;
}

/** Carrega o snapshot do dashboard uma vez, expondo loading/error. */
export function useDashboard(): UseDashboardState {
  const [state, setState] = useState<UseDashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getDashboard()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Erro ao carregar dashboard.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
