import { apiClient } from "@/shared/lib/api-client";
import type {
  Conquista,
  GamificacaoConfig,
  GamificacaoData,
  RankingEntry,
  Recompensa,
} from "../types";

/** Ordena o ranking do maior para o menor XP (função pura, não muta a entrada). */
export function ordenarRanking(ranking: RankingEntry[]): RankingEntry[] {
  return [...ranking].sort((a, b) => b.xp - a.xp);
}

/** Pódio: os 3 primeiros colocados por XP, já ordenados (função pura). */
export function podium(ranking: RankingEntry[]): RankingEntry[] {
  return ordenarRanking(ranking).slice(0, 3);
}

/**
 * Carrega os dados da tela /gamificacao (as quatro coleções em paralelo).
 *
 * `gamificacao_config` é um objeto singleton no json-server: `GET /gamificacao_config`
 * devolve o objeto diretamente (não uma lista), por isso o cast — não existe rota
 * `/gamificacao_config/:id` para usar `getOne`.
 */
export async function getGamificacaoData(): Promise<GamificacaoData> {
  const [ranking, recompensas, conquistas, config] = await Promise.all([
    apiClient.getList<RankingEntry>("ranking"),
    apiClient.getList<Recompensa>("recompensas"),
    apiClient.getList<Conquista>("conquistas"),
    apiClient.getList<GamificacaoConfig>("gamificacao_config") as unknown as Promise<GamificacaoConfig>,
  ]);

  return { ranking, recompensas, conquistas, config };
}
