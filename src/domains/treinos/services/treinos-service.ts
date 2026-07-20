import { apiClient } from "@/shared/lib/api-client";
import type { Exercicio, Ficha, FichaItemResolvido, TreinosData } from "../types";

/** Lista de grupos musculares distintos, em ordem alfabética. */
export function gruposMusculares(exercicios: Exercicio[]): string[] {
  const distintos = new Set(exercicios.map((e) => e.grupo));
  return Array.from(distintos).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/**
 * Resolve os itens de uma ficha, juntando cada `exercicioId` ao exercício
 * correspondente para expor nome/grupo/equipamento. Mantém series/reps/carga.
 * Função pura — não depende de estado externo.
 */
export function resolveFichaItens(ficha: Ficha, exercicios: Exercicio[]): FichaItemResolvido[] {
  const byId = new Map(exercicios.map((e) => [e.id, e]));
  return ficha.itens.map((item) => {
    const exercicio = byId.get(item.exercicioId);
    return {
      ...item,
      nome: exercicio?.nome ?? item.exercicioId,
      grupo: exercicio?.grupo ?? "—",
      equipamento: exercicio?.equipamento ?? "—",
    };
  });
}

/** Carrega os dados da tela /treinos (exercícios + fichas) em paralelo. */
export async function getTreinosData(): Promise<TreinosData> {
  const [exercicios, fichas] = await Promise.all([
    apiClient.getList<Exercicio>("exercicios"),
    apiClient.getList<Ficha>("fichas"),
  ]);
  return { exercicios, fichas };
}
