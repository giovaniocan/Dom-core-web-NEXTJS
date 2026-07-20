import { apiClient } from "@/shared/lib/api-client";
import type {
  Aula,
  AlunoLite,
  ModalidadeAccent,
  RosterEntry,
  Unidade,
  WeekGrid,
  WeekStats,
} from "../types";

/** Ordem canônica dos dias na grade semanal. */
export const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

const LOTADA_PCT = 100;
const CHEIA_PCT = 75;

// ---------------------------------------------------------------------------
// Camada de dados (apiClient)
// ---------------------------------------------------------------------------

/** Lista as aulas, opcionalmente filtrando por unidade. */
export function getAulas(unidadeId?: string): Promise<Aula[]> {
  return apiClient.getList<Aula>("aulas", unidadeId ? { unidadeId } : undefined);
}

/** Lista as unidades (para o filtro da agenda). */
export function getUnidades(): Promise<Unidade[]> {
  return apiClient.getList<Unidade>("unidades");
}

/** Lista os alunos (reduzidos ao necessário para montar o roster). */
export function getAlunosLite(): Promise<AlunoLite[]> {
  return apiClient.getList<AlunoLite>("alunos");
}

// ---------------------------------------------------------------------------
// Cálculos puros de ocupação
// ---------------------------------------------------------------------------

/** Percentual (0–100) de ocupação da turma. */
export function ocupacaoPct(aula: Pick<Aula, "inscritos" | "vagas">): number {
  if (aula.vagas <= 0) return 0;
  return Math.min(100, Math.round((aula.inscritos / aula.vagas) * 100));
}

/** Vagas ainda disponíveis (nunca negativo). */
export function vagasRestantes(aula: Pick<Aula, "inscritos" | "vagas">): number {
  return Math.max(0, aula.vagas - aula.inscritos);
}

/** True quando a turma atingiu (ou passou) a lotação. */
export function isLotada(aula: Pick<Aula, "inscritos" | "vagas">): boolean {
  return aula.inscritos >= aula.vagas;
}

/** Tom semântico da barra de ocupação a partir do percentual. */
export function ocupacaoTone(pct: number): "success" | "warning" | "danger" {
  if (pct >= LOTADA_PCT) return "danger";
  if (pct >= CHEIA_PCT) return "warning";
  return "success";
}

// ---------------------------------------------------------------------------
// Grade semanal
// ---------------------------------------------------------------------------

/** Horários distintos presentes nas aulas, em ordem crescente. */
export function uniqueHorarios(aulas: Aula[]): string[] {
  return [...new Set(aulas.map((a) => a.hora))].sort((a, b) => a.localeCompare(b));
}

/** Materializa a grade `matrix[hora][dia] = Aula[]`. */
export function buildWeekGrid(aulas: Aula[]): WeekGrid {
  const horarios = uniqueHorarios(aulas);
  const matrix: Record<string, Record<string, Aula[]>> = {};

  for (const hora of horarios) {
    matrix[hora] = {};
    for (const dia of DIAS_SEMANA) matrix[hora][dia] = [];
  }

  for (const aula of aulas) {
    if (!matrix[aula.hora]) continue;
    if (!matrix[aula.hora][aula.dia]) matrix[aula.hora][aula.dia] = [];
    matrix[aula.hora][aula.dia].push(aula);
  }

  return { horarios, dias: DIAS_SEMANA, matrix };
}

/** KPIs agregados da semana. */
export function weekStats(aulas: Aula[]): WeekStats {
  const totalAulas = aulas.length;
  const lotadas = aulas.filter(isLotada).length;
  const vagasAbertas = aulas.reduce((acc, a) => acc + vagasRestantes(a), 0);
  const ocupacaoMedia = totalAulas
    ? Math.round(aulas.reduce((acc, a) => acc + ocupacaoPct(a), 0) / totalAulas)
    : 0;
  return { totalAulas, ocupacaoMedia, lotadas, vagasAbertas };
}

// ---------------------------------------------------------------------------
// Cores por modalidade (apenas tokens Tailwind)
// ---------------------------------------------------------------------------

const ACCENTS: Record<string, ModalidadeAccent> = {
  primary: { bar: "bg-primary", soft: "bg-primary/10", text: "text-primary", border: "border-primary" },
  success: { bar: "bg-success", soft: "bg-success/10", text: "text-success", border: "border-success" },
  warning: { bar: "bg-warning", soft: "bg-warning/10", text: "text-warning", border: "border-warning" },
  danger: { bar: "bg-danger", soft: "bg-danger/10", text: "text-danger", border: "border-danger" },
  gold: { bar: "bg-gold", soft: "bg-gold/10", text: "text-gold", border: "border-gold" },
  silver: { bar: "bg-silver", soft: "bg-silver/10", text: "text-silver", border: "border-silver" },
  bronze: { bar: "bg-bronze", soft: "bg-bronze/10", text: "text-bronze", border: "border-bronze" },
};

const ACCENT_ORDER = ["primary", "warning", "success", "gold", "danger", "bronze", "silver"] as const;

/** Emparelhamento fixo das modalidades conhecidas (visual mais coerente). */
const KNOWN_MODALIDADES: Record<string, keyof typeof ACCENTS> = {
  Spinning: "primary",
  Funcional: "warning",
  Yoga: "success",
  "Cross DomCore": "danger",
  "Muay Thai": "bronze",
  Pilates: "gold",
  Zumba: "primary",
  Alongamento: "silver",
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Retorna as classes de cor (tokens) para uma modalidade, de forma determinística. */
export function modalidadeAccent(nome: string): ModalidadeAccent {
  const known = KNOWN_MODALIDADES[nome];
  if (known) return ACCENTS[known];
  const key = ACCENT_ORDER[hashString(nome) % ACCENT_ORDER.length];
  return ACCENTS[key];
}

// ---------------------------------------------------------------------------
// Roster de inscritos / presença
// ---------------------------------------------------------------------------

/**
 * Monta a lista de inscritos de uma turma a partir do pool de alunos.
 * Determinístico (baseado no id da aula), sem repetição, com presença simulada.
 */
export function buildRoster(
  aula: Pick<Aula, "id" | "inscritos">,
  alunos: AlunoLite[],
): RosterEntry[] {
  if (alunos.length === 0) return [];
  const size = Math.min(aula.inscritos, alunos.length);
  const start = hashString(aula.id) % alunos.length;

  const roster: RosterEntry[] = [];
  for (let i = 0; i < size; i++) {
    const aluno = alunos[(start + i) % alunos.length];
    roster.push({
      alunoId: aluno.id,
      nome: aluno.nome,
      foto: aluno.foto,
      presente: hashString(`${aula.id}:${aluno.id}`) % 4 !== 0,
    });
  }
  return roster;
}
