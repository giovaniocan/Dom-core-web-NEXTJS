import { apiClient } from "@/shared/lib/api-client";
import type { DashboardSnapshot, RankingEntry, ReceitaMes } from "../types";

/** Busca o snapshot atual do dashboard (coleção singleton no db.json). */
export async function getDashboard(): Promise<DashboardSnapshot> {
  const [snapshot] = await apiClient.getList<DashboardSnapshot>("dashboard");
  if (!snapshot) {
    throw new Error("Snapshot de dashboard indisponível (coleção 'dashboard' vazia).");
  }
  return snapshot;
}

/** Retorna o pódio (top 3) do ranking, ordenado por posição crescente. */
export function pickPodium(ranking: RankingEntry[]): RankingEntry[] {
  return [...ranking].sort((a, b) => a.posicao - b.posicao).slice(0, 3);
}

/** Percentual (0–100) da receita realizada frente à meta. */
export function revenueProgress({ total, meta }: ReceitaMes): number {
  if (meta <= 0) return 0;
  return Math.min(100, Math.round((total / meta) * 100));
}
