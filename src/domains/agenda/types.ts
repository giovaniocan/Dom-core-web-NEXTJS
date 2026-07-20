/** Tipos do domínio Agenda (coleção `aulas` do db.json + apoio de `unidades`/`alunos`). */

/** Uma aula coletiva agendada na grade semanal. */
export interface Aula {
  id: string;
  nome: string;
  professor: string;
  unidadeId: string;
  dia: string;
  hora: string;
  vagas: number;
  inscritos: number;
}

/** Unidade (subconjunto usado no filtro da agenda). */
export interface Unidade {
  id: string;
  nome: string;
}

/** Aluno reduzido, usado para montar o roster de inscritos/presença. */
export interface AlunoLite {
  id: string;
  nome: string;
  foto?: string;
  status?: string;
}

/** Entrada do roster de uma turma: aluno inscrito + presença. */
export interface RosterEntry {
  alunoId: string;
  nome: string;
  foto?: string;
  presente: boolean;
}

/** Classes utilitárias (tokens Tailwind) que colorem cada modalidade. */
export interface ModalidadeAccent {
  /** Barra sólida (ex.: borda lateral do card). */
  bar: string;
  /** Fundo suave. */
  soft: string;
  /** Texto/realce. */
  text: string;
  /** Cor da borda. */
  border: string;
}

/** Grade semanal materializada: `matrix[hora][dia]` → aulas naquele slot. */
export interface WeekGrid {
  horarios: string[];
  dias: readonly string[];
  matrix: Record<string, Record<string, Aula[]>>;
}

/** Métricas agregadas da semana (KPIs). */
export interface WeekStats {
  totalAulas: number;
  ocupacaoMedia: number;
  lotadas: number;
  vagasAbertas: number;
}
