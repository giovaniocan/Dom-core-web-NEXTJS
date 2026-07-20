import { apiClient } from "@/shared/lib/api-client";
import type {
  Aluno,
  AlunoDetalhe,
  AlunosFilter,
  Acesso,
  Conquista,
  Exercicio,
  Fatura,
  Ficha,
  NivelXp,
  RankingEntry,
  ResumoFinanceiro,
  StatusContagem,
} from "../types";

/** Lista completa de alunos. */
export function getAlunos(): Promise<Aluno[]> {
  return apiClient.getList<Aluno>("alunos");
}

/** Busca um aluno pelo id. */
export function getAluno(id: string): Promise<Aluno> {
  return apiClient.getOne<Aluno>("alunos", id);
}

/** Agrega o aluno e todas as coleções relacionadas para a ficha 360. */
export async function getAlunoDetalhe(id: string): Promise<AlunoDetalhe> {
  const [aluno, faturas, acessos, fichas, exercicios, ranking] = await Promise.all([
    getAluno(id),
    apiClient.getList<Fatura>("faturas", { alunoId: id }),
    apiClient.getList<Acesso>("acessos", { alunoId: id }),
    apiClient.getList<Ficha>("fichas", { alunoId: id }),
    apiClient.getList<Exercicio>("exercicios"),
    apiClient.getList<RankingEntry>("ranking"),
  ]);

  return { aluno, faturas, acessos, fichas, exercicios, ranking };
}

/** Filtra alunos por busca livre (nome/matrícula/telefone/email), status e plano. */
export function filterAlunos(alunos: Aluno[], filter: AlunosFilter): Aluno[] {
  const term = filter.search.trim().toLowerCase();

  return alunos.filter((aluno) => {
    if (filter.status !== "todos" && aluno.status !== filter.status) return false;
    if (filter.plano !== "todos" && aluno.plano !== filter.plano) return false;
    if (!term) return true;

    const haystack = [aluno.nome, aluno.matricula, aluno.telefone, aluno.email]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

/** Lista de planos distintos presentes na base, ordenada alfabeticamente. */
export function planoOptions(alunos: Aluno[]): string[] {
  return [...new Set(alunos.map((a) => a.plano))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/** Consolida o estado financeiro de um aluno a partir das suas faturas. */
export function summarizeFaturas(faturas: Fatura[]): ResumoFinanceiro {
  return faturas.reduce<ResumoFinanceiro>(
    (acc, fatura) => {
      acc.totalFaturas += 1;
      if (fatura.status === "paga") acc.totalPago += fatura.valor;
      if (fatura.status === "aberta") acc.emAberto += fatura.valor;
      if (fatura.status === "vencida") {
        acc.vencido += fatura.valor;
        acc.vencidas += 1;
      }
      return acc;
    },
    { totalFaturas: 0, totalPago: 0, emAberto: 0, vencido: 0, vencidas: 0 },
  );
}

/** Posição do aluno no ranking de engajamento, ou null se não pontuado. */
export function rankingPosicao(ranking: RankingEntry[], alunoId: string): number | null {
  const entry = ranking.find((r) => r.alunoId === alunoId);
  return entry ? entry.posicao : null;
}

/** Contagem total e por status para os KPIs da listagem. */
export function contarPorStatus(alunos: Aluno[]): StatusContagem {
  return alunos.reduce<StatusContagem>(
    (acc, aluno) => {
      acc.total += 1;
      acc[aluno.status] += 1;
      return acc;
    },
    { total: 0, ativo: 0, inadimplente: 0, trancado: 0 },
  );
}

/** XP necessário para avançar um nível de engajamento. */
export const XP_POR_NIVEL = 1000;

/** Deriva nível, progresso e XP restante a partir do XP acumulado. */
export function nivelFromXp(xp: number): NivelXp {
  const safe = Math.max(0, xp);
  const nivel = Math.floor(safe / XP_POR_NIVEL) + 1;
  const xpNoNivel = safe % XP_POR_NIVEL;
  const xpParaProximo = XP_POR_NIVEL - xpNoNivel;
  const pct = (xpNoNivel / XP_POR_NIVEL) * 100;
  return { nivel, xpNoNivel, xpParaProximo, pct };
}

/** Catálogo de conquistas, cada uma marcada como desbloqueada (earned) ou não. */
export function conquistas(
  aluno: Pick<Aluno, "xp" | "streak" | "status">,
  posicao: number | null,
): Conquista[] {
  return [
    {
      id: "primeiro-milhar",
      label: "Primeiro milhar",
      descricao: "Acumulou 1.000 XP",
      earned: aluno.xp >= 1000,
    },
    {
      id: "elite-xp",
      label: "Elite XP",
      descricao: "Acumulou 3.000 XP",
      earned: aluno.xp >= 3000,
    },
    {
      id: "ofensiva",
      label: "Ofensiva de fogo",
      descricao: "7 dias seguidos de treino",
      earned: aluno.streak >= 7,
    },
    {
      id: "maratonista",
      label: "Maratonista",
      descricao: "30 dias seguidos de treino",
      earned: aluno.streak >= 30,
    },
    {
      id: "podio",
      label: "Pódio",
      descricao: "Top 3 do ranking da unidade",
      earned: posicao !== null && posicao <= 3,
    },
    {
      id: "assiduo",
      label: "Assíduo",
      descricao: "Matrícula ativa e em dia",
      earned: aluno.status === "ativo",
    },
  ];
}
