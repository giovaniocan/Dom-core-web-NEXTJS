/** Tipos do domínio Dieta (planos alimentares, metas de macros e adesão). */

/** Totais/metas de macronutrientes de um dia. */
export interface MacroTotais {
  kcal: number;
  proteina: number;
  carbo: number;
  gordura: number;
}

/** Uma refeição do plano — espelha os itens de `planos_alimentares[].refeicoes`. */
export interface Refeicao {
  nome: string;
  horario: string;
  itens: string[];
  kcal: number;
  proteina: number;
  carbo: number;
  gordura: number;
  feito: boolean;
}

/** Plano alimentar — espelha a coleção `planos_alimentares` do db.json. */
export interface PlanoAlimentar {
  id: string;
  alunoId: string;
  nutriId: string;
  metas: MacroTotais;
  refeicoes: Refeicao[];
  notaNutri?: string;
}

/** Aluno — subconjunto usado para nomear/ilustrar o dono do plano (coleção `alunos`). */
export interface AlunoResumo {
  id: string;
  nome: string;
  foto: string;
}

/** Profissional — subconjunto usado para o nome do nutricionista (coleção `profissionais`). */
export interface ProfissionalResumo {
  id: string;
  nome: string;
}

/** Adesão do dia: refeições feitas frente ao total. */
export interface Adesao {
  feitas: number;
  total: number;
  /** Percentual (0–100) de refeições marcadas como feitas. */
  percent: number;
}

/** Payload da tela /dieta. */
export interface DietaData {
  planos: PlanoAlimentar[];
  alunos: AlunoResumo[];
  profissionais: ProfissionalResumo[];
}
