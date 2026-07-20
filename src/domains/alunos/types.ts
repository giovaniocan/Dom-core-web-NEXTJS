/** Tipos do domínio Alunos (CRM). Espelham os campos das coleções do db.json. */

export type AlunoStatus = "ativo" | "inadimplente" | "trancado";

export interface Aluno {
  id: string;
  academiaId: string;
  unidadeId: string;
  nome: string;
  genero: "F" | "M" | string;
  email: string;
  telefone: string;
  foto: string;
  status: AlunoStatus;
  planoId: string;
  plano: string;
  matricula: string;
  vencimento: string;
  ultima_visita: string;
  xp: number;
  streak: number;
  nascimento: string;
}

export type FaturaStatus = "paga" | "aberta" | "vencida";
export type FaturaMeio = "pix" | "cartao" | "boleto";

export interface Fatura {
  id: string;
  alunoId: string;
  aluno: string;
  contratoId: string;
  competencia: string;
  vencimento: string;
  valor: number;
  status: FaturaStatus;
  meio: FaturaMeio;
  pago_em: string | null;
  tentativas_cobranca: number;
  ultima_tentativa: string | null;
}

export type AcessoSentido = "entrada" | "saida";
export type AcessoResultado = "liberado" | "negado";

export interface Acesso {
  id: string;
  alunoId: string;
  aluno: string;
  foto: string;
  unidadeId: string;
  terminal: string;
  sentido: AcessoSentido;
  resultado: AcessoResultado;
  motivo: string | null;
  timestamp: string;
}

export interface Exercicio {
  id: string;
  nome: string;
  grupo: string;
  equipamento: string;
}

export interface FichaItem {
  exercicioId: string;
  series: number;
  reps: string;
  carga_kg: number;
}

export interface Ficha {
  id: string;
  alunoId: string;
  nome: string;
  objetivo: string;
  professor: string;
  itens: FichaItem[];
}

export interface RankingEntry {
  id: string;
  posicao: number;
  alunoId: string;
  nome: string;
  xp: number;
  streak: number;
}

/** Filtros da listagem de alunos (busca livre + status + plano). */
export interface AlunosFilter {
  search: string;
  status: AlunoStatus | "todos";
  plano: string | "todos";
}

/** Resumo financeiro derivado das faturas de um aluno. */
export interface ResumoFinanceiro {
  totalFaturas: number;
  totalPago: number;
  emAberto: number;
  vencido: number;
  vencidas: number;
}

/** Contagem de alunos por status, para os KPIs da listagem. */
export interface StatusContagem {
  total: number;
  ativo: number;
  inadimplente: number;
  trancado: number;
}

/** Nível de engajamento derivado do XP acumulado. */
export interface NivelXp {
  nivel: number;
  xpNoNivel: number;
  xpParaProximo: number;
  pct: number;
}

/** Conquista de gamificação (desbloqueada ou não). */
export interface Conquista {
  id: string;
  label: string;
  descricao: string;
  earned: boolean;
}

/** Pacote agregado consumido pela ficha 360 do aluno. */
export interface AlunoDetalhe {
  aluno: Aluno;
  faturas: Fatura[];
  acessos: Acesso[];
  fichas: Ficha[];
  exercicios: Exercicio[];
  ranking: RankingEntry[];
}
