/** Tipos do domínio Profissionais (equipe da academia e carteira de alunos). */

/** Profissional — espelha a coleção `profissionais` do db.json. */
export interface Profissional {
  id: string;
  nome: string;
  /** Função na equipe: "Personal", "Nutricionista", "Recepção"... */
  papel: string;
  cref: string;
  unidadeId: string;
  alunos_ativos: number;
  foto: string;
}

/** Item de treino de uma ficha (subconjunto usado no domínio). */
export interface FichaItem {
  exercicioId: string;
  series: number;
  reps: string;
  carga_kg: number;
}

/**
 * Ficha — espelha a coleção `fichas` do db.json. Não há vínculo direto
 * aluno→profissional; a carteira é derivada por `professor` (nome do profissional).
 */
export interface Ficha {
  id: string;
  alunoId: string;
  nome: string;
  objetivo: string;
  /** Nome do professor responsável — casa com `Profissional.nome`. */
  professor: string;
  itens: FichaItem[];
}

/** Aluno — subconjunto usado na carteira do profissional (coleção `alunos`). */
export interface AlunoResumo {
  id: string;
  nome: string;
  foto: string;
  status: string;
  plano: string;
}

/** Payload da tela /profissionais (equipe + fichas + alunos para a carteira). */
export interface ProfissionaisData {
  profissionais: Profissional[];
  fichas: Ficha[];
  alunos: AlunoResumo[];
}
