import { apiClient } from "@/shared/lib/api-client";
import type {
  Adesao,
  AlunoResumo,
  DietaData,
  MacroTotais,
  PlanoAlimentar,
  ProfissionalResumo,
  Refeicao,
} from "../types";

/** Soma (pura) os macronutrientes de todas as refeições do dia. */
export function somaMacros(refeicoes: Refeicao[]): MacroTotais {
  return refeicoes.reduce<MacroTotais>(
    (acc, r) => ({
      kcal: acc.kcal + r.kcal,
      proteina: acc.proteina + r.proteina,
      carbo: acc.carbo + r.carbo,
      gordura: acc.gordura + r.gordura,
    }),
    { kcal: 0, proteina: 0, carbo: 0, gordura: 0 },
  );
}

/**
 * Adesão (pura): quantas refeições foram feitas frente ao total.
 * `percent = feitas / total * 100`, arredondado; protege total 0 → 0%.
 */
export function adesao(refeicoes: Refeicao[]): Adesao {
  const total = refeicoes.length;
  const feitas = refeicoes.filter((r) => r.feito).length;
  const percent = total > 0 ? Math.round((feitas / total) * 100) : 0;
  return { feitas, total, percent };
}

/** Carrega os dados da tela /dieta (planos + alunos + profissionais) em paralelo. */
export async function getDietaData(): Promise<DietaData> {
  const [planos, alunos, profissionais] = await Promise.all([
    apiClient.getList<PlanoAlimentar>("planos_alimentares"),
    apiClient.getList<AlunoResumo>("alunos"),
    apiClient.getList<ProfissionalResumo>("profissionais"),
  ]);
  return { planos, alunos, profissionais };
}
