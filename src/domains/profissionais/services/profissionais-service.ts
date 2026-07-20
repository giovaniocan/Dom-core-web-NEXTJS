import { apiClient } from "@/shared/lib/api-client";
import type { AlunoResumo, Ficha, Profissional, ProfissionaisData } from "../types";

/**
 * Deriva a "carteira de alunos" de um profissional: como não há vínculo direto
 * aluno→profissional, casa as fichas cujo `professor` é igual ao `nome` do
 * profissional e mapeia `ficha.alunoId` → aluno. Deduplica por id de aluno,
 * preservando a ordem de aparição das fichas.
 */
export function alunosDoProfissional(
  prof: Profissional,
  fichas: Ficha[],
  alunos: AlunoResumo[],
): AlunoResumo[] {
  const alunoById = new Map(alunos.map((a) => [a.id, a]));
  const vistos = new Set<string>();
  const carteira: AlunoResumo[] = [];

  for (const ficha of fichas) {
    if (ficha.professor !== prof.nome) continue;
    if (vistos.has(ficha.alunoId)) continue;
    const aluno = alunoById.get(ficha.alunoId);
    if (!aluno) continue;
    vistos.add(ficha.alunoId);
    carteira.push(aluno);
  }

  return carteira;
}

/** Lista distinta de papéis presentes na equipe, na ordem de aparição. */
export function papeisDisponiveis(profissionais: Profissional[]): string[] {
  const vistos = new Set<string>();
  const papeis: string[] = [];

  for (const prof of profissionais) {
    if (vistos.has(prof.papel)) continue;
    vistos.add(prof.papel);
    papeis.push(prof.papel);
  }

  return papeis;
}

/** Carrega os dados da tela /profissionais (profissionais + fichas + alunos) em paralelo. */
export async function getProfissionaisData(): Promise<ProfissionaisData> {
  const [profissionais, fichas, alunos] = await Promise.all([
    apiClient.getList<Profissional>("profissionais"),
    apiClient.getList<Ficha>("fichas"),
    apiClient.getList<AlunoResumo>("alunos"),
  ]);
  return { profissionais, fichas, alunos };
}
