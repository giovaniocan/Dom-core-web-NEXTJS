/** Tipos do domínio Catraca / Acesso (coleção `acessos`, com apoio de `alunos` e `unidades`). */

export type Sentido = "entrada" | "saida";
export type Resultado = "liberado" | "negado";

/** Registro bruto de uma passagem na catraca (db.json → acessos). */
export interface Acesso {
  id: string;
  alunoId: string;
  aluno: string;
  foto: string;
  unidadeId: string;
  terminal: string;
  sentido: Sentido;
  resultado: Resultado;
  motivo: string | null;
  timestamp: string; // ISO
}

/** Subconjunto de aluno usado pela frequência (db.json → alunos). */
export interface AlunoLite {
  id: string;
  nome: string;
  foto: string;
  status: string; // "ativo" | "inadimplente" | "trancado"
  plano: string;
  unidadeId: string;
  ultima_visita: string; // "aaaa-mm-dd"
}

/** Unidade da academia (db.json → unidades). */
export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
  catracas: number;
}

/** Aluno que está dentro da academia agora (última passagem liberada foi entrada). */
export interface PresencaAluno {
  alunoId: string;
  aluno: string;
  foto: string;
  unidadeId: string;
  terminal: string;
  desde: string; // timestamp da entrada
}

/** Estado agregado de um terminal/catraca físico. */
export interface TerminalInfo {
  terminal: string;
  unidadeId: string;
  ultimaAtividade: string;
  totalPassagens: number;
  online: boolean;
}

/** Frequência acumulada de um aluno (nº de entradas liberadas). */
export interface FrequenciaAluno {
  alunoId: string;
  nome: string;
  foto: string;
  status: string;
  entradas: number;
  ultimaEntrada: string | null;
}

/** Aluno "sumido" — sem visita há mais de N dias (excluindo trancados). */
export interface AlunoSumido {
  id: string;
  nome: string;
  foto: string;
  status: string;
  ultima_visita: string;
  diasAusente: number;
}

/** Ocupação atual de uma unidade (quantos dentro × capacidade). */
export interface OcupacaoUnidade {
  unidadeId: string;
  nome: string;
  dentro: number;
  capacidade: number;
  pct: number;
}

/** Grade dia-da-semana × hora para o heatmap de horários de pico. */
export interface Heatmap {
  grid: number[][]; // [7 dias][24 horas]
  max: number;
}

/** Contagem de passagens de um dia (liberadas × negadas). */
export interface ContagemDia {
  liberados: number;
  negados: number;
  total: number;
}

/** Dados brutos carregados pelo hook e derivados nas views. */
export interface CatracaData {
  acessos: Acesso[];
  alunos: AlunoLite[];
  unidades: Unidade[];
}
