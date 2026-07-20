/** Tipos do domínio Treinos (biblioteca de exercícios e fichas de treino). */

/** Exercício — espelha a coleção `exercicios` do db.json. */
export interface Exercicio {
  id: string;
  nome: string;
  grupo: string;
  equipamento: string;
}

/** Item cru de uma ficha (referencia um exercício por id). */
export interface FichaItem {
  exercicioId: string;
  series: number;
  reps: string;
  carga_kg: number;
}

/** Ficha — espelha a coleção `fichas` do db.json. */
export interface Ficha {
  id: string;
  alunoId: string;
  nome: string;
  objetivo: string;
  professor: string;
  itens: FichaItem[];
}

/** Item de ficha enriquecido com o nome/grupo/equipamento do exercício resolvido. */
export interface FichaItemResolvido extends FichaItem {
  /** Nome do exercício resolvido (fallback = próprio exercicioId). */
  nome: string;
  /** Grupo muscular resolvido (fallback = "—"). */
  grupo: string;
  /** Equipamento resolvido (fallback = "—"). */
  equipamento: string;
}

/** Payload da tela /treinos (biblioteca + fichas). */
export interface TreinosData {
  exercicios: Exercicio[];
  fichas: Ficha[];
}
