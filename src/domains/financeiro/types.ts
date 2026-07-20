/** Tipos do domínio Financeiro (faturas, planos, inadimplência e régua de dunning). */

export type FaturaStatus = "paga" | "aberta" | "vencida";
export type MeioPagamento = "pix" | "cartao" | "boleto";

/** Fatura — espelha a coleção `faturas` do db.json. */
export interface Fatura {
  id: string;
  alunoId: string;
  aluno: string;
  contratoId: string;
  competencia: string;
  vencimento: string;
  valor: number;
  status: FaturaStatus;
  meio: MeioPagamento;
  pago_em: string | null;
  tentativas_cobranca: number;
  ultima_tentativa: string | null;
}

/** Plano — subconjunto usado no financeiro (coleção `planos`). */
export interface Plano {
  id: string;
  nome: string;
  valor: number;
  periodo_meses: number;
  descricao: string;
}

/** Aluno — subconjunto usado para enriquecer a inadimplência (coleção `alunos`). */
export interface AlunoResumo {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto: string;
  status: string;
  plano: string;
  planoId: string;
}

/** KPIs agregados da tela /financeiro. */
export interface FinanceiroKpis {
  recebidoMes: number;
  aReceber: number;
  emAtraso: number;
  qtdPagas: number;
  qtdAbertas: number;
  qtdVencidas: number;
  /** Percentual (0–100) do valor em atraso frente ao total faturado. */
  taxaInadimplencia: number;
}

/** Linha da tabela de inadimplentes: fatura vencida + aluno + dias em atraso. */
export interface InadimplenteRow {
  fatura: Fatura;
  aluno: AlunoResumo | null;
  diasAtraso: number;
}

/** Resultado de uma etapa da régua de dunning (D+1, D+3, D+5, D+7). */
export interface DunningStageResult {
  key: string;
  dia: number;
  titulo: string;
  acao: string;
  /** Taxa de recuperação de referência (0–1). */
  taxaRecuperacao: number;
  /** Faturas que já atingiram (>=) este dia de atraso. */
  atingidas: number;
  /** Valor somado das faturas que atingiram esta etapa. */
  valorAtingido: number;
}

/** Régua de cobrança completa + agregados de recuperação. */
export interface DunningRegua {
  stages: DunningStageResult[];
  qtdVencidas: number;
  valorVencido: number;
  /** Valor estimado recuperável (soma valor × taxa da etapa atual de cada fatura). */
  recuperacaoEstimada: number;
  /** Valor sob risco de perda (vencido − recuperação estimada). */
  valorEmRisco: number;
  /** Taxa média ponderada de recuperação (0–100). */
  taxaRecuperacaoMedia: number;
}

/** Payload da tela /financeiro. */
export interface FinanceiroData {
  faturas: Fatura[];
  planos: Plano[];
}

/** Payload da tela /financeiro/inadimplencia. */
export interface InadimplenciaData {
  faturasVencidas: Fatura[];
  alunos: AlunoResumo[];
}
