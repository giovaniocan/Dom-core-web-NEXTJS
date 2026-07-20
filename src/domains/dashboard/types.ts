/** Tipos do domínio Dashboard. */

export interface DashboardKpis {
  alunosAtivos: number;
  alunosAtivosDelta: string;
  checkinsHoje: number;
  inadimplentes: number;
  aReceber: number;
  novosNoMes: number;
  novosNoMesDelta: string;
  ocupacaoPct: number;
}

export interface FrequenciaDia {
  dia: string; // "Seg", "Ter"...
  entradas: number;
}

export interface ReceitaMes {
  total: number;
  meta: number;
}

export interface RankingEntry {
  posicao: number;
  alunoId: string;
  nome: string;
  xp: number;
  streak: number;
}

export type PendenciaTipo = "inadimplencia" | "renovacao" | "aniversario" | "avaliacao";

export interface Pendencia {
  tipo: PendenciaTipo;
  titulo: string;
  quantidade: number;
}

/** Snapshot completo consumido pela tela de Dashboard. */
export interface DashboardSnapshot {
  id: string;
  kpis: DashboardKpis;
  frequenciaSemana: FrequenciaDia[];
  receitaMes: ReceitaMes;
  ranking: RankingEntry[];
  pendencias: Pendencia[];
}
