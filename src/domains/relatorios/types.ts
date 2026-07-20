/** Tipos do domínio Relatórios / BI (KPIs e séries derivadas por agregação pura). */

export type FaturaStatus = "paga" | "aberta" | "vencida";

/** Fatura — subconjunto usado nos relatórios (coleção `faturas`). */
export interface Fatura {
  id: string;
  alunoId: string;
  competencia: string;
  vencimento: string;
  valor: number;
  status: FaturaStatus;
  pago_em: string | null;
  meio: string;
}

/** Acesso na catraca — subconjunto usado nos relatórios (coleção `acessos`). */
export interface Acesso {
  id: string;
  alunoId: string;
  sentido: "entrada" | "saida";
  resultado: "liberado" | "negado";
  timestamp: string;
}

/** Aluno — subconjunto usado nos relatórios (coleção `alunos`). */
export interface AlunoResumo {
  id: string;
  nome: string;
  status: string;
  matricula: string;
}

/** Contrato — subconjunto usado nos relatórios (coleção `contratos`). */
export interface Contrato {
  id: string;
  alunoId: string;
  planoId: string;
  inicio: string;
  fim: string;
  status: string;
  valor_mensal: number;
}

/** Ponto genérico de gráfico (rótulo + valor) — consumido por BarChart/LineChart. */
export interface ChartDatum {
  label: string;
  value: number;
}

/** Receita reconhecida (faturas pagas) agrupada por competência. */
export interface ReceitaCompetencia {
  competencia: string;
  total: number;
}

/** Entradas liberadas agrupadas por dia de calendário local. */
export interface FrequenciaDia {
  dia: string;
  entradas: number;
}

/** KPIs de negócio agregados da tela /relatorios. */
export interface RelatoriosKpis {
  /** Receita recorrente mensal: soma de valor_mensal dos contratos ativos. */
  mrr: number;
  /** Quantidade de alunos com status "ativo". */
  alunosAtivos: number;
  /** % de faturas vencidas sobre o total faturado (por quantidade), 0–100. */
  percentInadimplencia: number;
  /** % de contratos cancelados sobre o total, 0–100. */
  churn: number;
}

/** Payload da tela /relatorios (4 coleções agregadas por derivação). */
export interface RelatoriosData {
  faturas: Fatura[];
  acessos: Acesso[];
  alunos: AlunoResumo[];
  contratos: Contrato[];
}
