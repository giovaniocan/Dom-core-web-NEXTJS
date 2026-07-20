import { apiClient } from "@/shared/lib/api-client";
import type {
  Acesso,
  AlunoLite,
  AlunoSumido,
  CatracaData,
  ContagemDia,
  FrequenciaAluno,
  Heatmap,
  OcupacaoUnidade,
  PresencaAluno,
  TerminalInfo,
  Unidade,
} from "../types";

const DEFAULT_FEED_LIMIT = 12;
const DEFAULT_ONLINE_WINDOW_MIN = 180;
const DEFAULT_DIAS_SUMIDO = 5;
const DIAS_NA_SEMANA = 7;
const HORAS_NO_DIA = 24;

/** Carrega em paralelo as coleções necessárias ao domínio catraca. */
export async function loadCatracaData(): Promise<CatracaData> {
  const [acessos, alunos, unidades] = await Promise.all([
    apiClient.getList<Acesso>("acessos"),
    apiClient.getList<AlunoLite>("alunos"),
    apiClient.getList<Unidade>("unidades"),
  ]);
  return { acessos, alunos, unidades };
}

/** Ordena passagens da mais recente para a mais antiga (sem mutar o array). */
export function sortByTimestampDesc(acessos: Acesso[]): Acesso[] {
  return [...acessos].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/** Timestamp mais recente da coleção, ou null se vazia. */
export function latestTimestamp(acessos: Acesso[]): string | null {
  if (acessos.length === 0) return null;
  return acessos.reduce((max, a) => (a.timestamp > max ? a.timestamp : max), acessos[0].timestamp);
}

/**
 * Quem está na academia agora: para cada aluno, a última passagem LIBERADA;
 * se ela foi uma entrada, o aluno está dentro. Ordenado pela entrada mais recente.
 */
export function computePresence(acessos: Acesso[]): PresencaAluno[] {
  const ultimaPorAluno = new Map<string, Acesso>();

  for (const acesso of acessos) {
    if (acesso.resultado !== "liberado") continue;
    const atual = ultimaPorAluno.get(acesso.alunoId);
    if (!atual || acesso.timestamp > atual.timestamp) {
      ultimaPorAluno.set(acesso.alunoId, acesso);
    }
  }

  const presentes: PresencaAluno[] = [];
  for (const acesso of ultimaPorAluno.values()) {
    if (acesso.sentido !== "entrada") continue;
    presentes.push({
      alunoId: acesso.alunoId,
      aluno: acesso.aluno,
      foto: acesso.foto,
      unidadeId: acesso.unidadeId,
      terminal: acesso.terminal,
      desde: acesso.timestamp,
    });
  }

  return presentes.sort((a, b) => b.desde.localeCompare(a.desde));
}

/** Percentual de ocupação (0–100), tratando capacidade zero. */
export function ocupacaoPct(dentro: number, capacidade: number): number {
  if (capacidade <= 0) return 0;
  return Math.min(100, Math.round((dentro / capacidade) * 100));
}

/** Ocupação por unidade: nº de presentes / capacidade, preservando todas as unidades. */
export function occupancyByUnidade(
  presentes: PresencaAluno[],
  unidades: Unidade[],
): OcupacaoUnidade[] {
  const dentroPorUnidade = new Map<string, number>();
  for (const p of presentes) {
    dentroPorUnidade.set(p.unidadeId, (dentroPorUnidade.get(p.unidadeId) ?? 0) + 1);
  }

  return unidades.map((u) => {
    const dentro = dentroPorUnidade.get(u.id) ?? 0;
    return {
      unidadeId: u.id,
      nome: u.nome,
      dentro,
      capacidade: u.capacidade,
      pct: ocupacaoPct(dentro, u.capacidade),
    };
  });
}

/** Feed das passagens mais recentes (liberado/negado). */
export function recentPasses(acessos: Acesso[], limit: number = DEFAULT_FEED_LIMIT): Acesso[] {
  return sortByTimestampDesc(acessos).slice(0, limit);
}

/** Estado agregado por terminal físico. `online` = atividade dentro da janela. */
export function buildTerminals(
  acessos: Acesso[],
  nowIso?: string,
  windowMin: number = DEFAULT_ONLINE_WINDOW_MIN,
): TerminalInfo[] {
  const now = nowIso ?? latestTimestamp(acessos);
  const nowMs = now ? Date.parse(now) : Date.now();

  const porTerminal = new Map<string, TerminalInfo>();
  for (const acesso of acessos) {
    const atual = porTerminal.get(acesso.terminal);
    if (!atual) {
      porTerminal.set(acesso.terminal, {
        terminal: acesso.terminal,
        unidadeId: acesso.unidadeId,
        ultimaAtividade: acesso.timestamp,
        totalPassagens: 1,
        online: false,
      });
      continue;
    }
    atual.totalPassagens += 1;
    if (acesso.timestamp > atual.ultimaAtividade) atual.ultimaAtividade = acesso.timestamp;
  }

  const terminais = [...porTerminal.values()];
  for (const t of terminais) {
    const idleMin = (nowMs - Date.parse(t.ultimaAtividade)) / 60_000;
    t.online = idleMin <= windowMin;
  }

  return terminais.sort((a, b) => a.terminal.localeCompare(b.terminal));
}

function sameUtcDate(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

/** Contagem de passagens (liberadas × negadas) no dia da referência. */
export function contagemDoDia(acessos: Acesso[], refIso?: string): ContagemDia {
  const ref = refIso ?? latestTimestamp(acessos);
  if (!ref) return { liberados: 0, negados: 0, total: 0 };

  let liberados = 0;
  let negados = 0;
  for (const acesso of acessos) {
    if (!sameUtcDate(acesso.timestamp, ref)) continue;
    if (acesso.resultado === "liberado") liberados += 1;
    else negados += 1;
  }
  return { liberados, negados, total: liberados + negados };
}

function emptyGrid(): number[][] {
  return Array.from({ length: DIAS_NA_SEMANA }, () => new Array<number>(HORAS_NO_DIA).fill(0));
}

/** Grade dia-da-semana × hora contando apenas entradas liberadas (horários de pico). */
export function buildHeatmap(acessos: Acesso[]): Heatmap {
  const grid = emptyGrid();
  let max = 0;

  for (const acesso of acessos) {
    if (acesso.resultado !== "liberado" || acesso.sentido !== "entrada") continue;
    const date = new Date(acesso.timestamp);
    const dia = date.getUTCDay();
    const hora = date.getUTCHours();
    grid[dia][hora] += 1;
    if (grid[dia][hora] > max) max = grid[dia][hora];
  }

  return { grid, max };
}

/** Hora do dia (0–23) com mais entradas liberadas; empate → hora menor. */
export function peakHour(acessos: Acesso[]): { hora: number; total: number } | null {
  const porHora = new Array<number>(HORAS_NO_DIA).fill(0);
  let temEntrada = false;

  for (const acesso of acessos) {
    if (acesso.resultado !== "liberado" || acesso.sentido !== "entrada") continue;
    porHora[new Date(acesso.timestamp).getUTCHours()] += 1;
    temEntrada = true;
  }

  if (!temEntrada) return null;

  let hora = 0;
  for (let h = 1; h < HORAS_NO_DIA; h += 1) {
    if (porHora[h] > porHora[hora]) hora = h;
  }
  return { hora, total: porHora[hora] };
}

/** Frequência (nº de entradas liberadas) por aluno; exclui quem nunca entrou. */
export function frequencyByAluno(acessos: Acesso[], alunos: AlunoLite[]): FrequenciaAluno[] {
  const stats = new Map<string, { entradas: number; ultima: string | null }>();

  for (const acesso of acessos) {
    if (acesso.resultado !== "liberado" || acesso.sentido !== "entrada") continue;
    const atual = stats.get(acesso.alunoId) ?? { entradas: 0, ultima: null };
    atual.entradas += 1;
    if (!atual.ultima || acesso.timestamp > atual.ultima) atual.ultima = acesso.timestamp;
    stats.set(acesso.alunoId, atual);
  }

  const frequencias: FrequenciaAluno[] = [];
  for (const aluno of alunos) {
    const s = stats.get(aluno.id);
    if (!s || s.entradas === 0) continue;
    frequencias.push({
      alunoId: aluno.id,
      nome: aluno.nome,
      foto: aluno.foto,
      status: aluno.status,
      entradas: s.entradas,
      ultimaEntrada: s.ultima,
    });
  }

  return frequencias.sort((a, b) => b.entradas - a.entradas || a.nome.localeCompare(b.nome));
}

function toUtcMidnight(value: string): number {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Dias inteiros entre duas datas (comparação por data, UTC). */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((toUtcMidnight(toIso) - toUtcMidnight(fromIso)) / 86_400_000);
}

/**
 * Alunos "sumidos": não-trancados cuja última visita passou do limite de dias.
 * `refIso` é o ponto de referência ("hoje"); ordena por ausência decrescente.
 */
export function alunosSumidos(
  alunos: AlunoLite[],
  refIso: string,
  thresholdDays: number = DEFAULT_DIAS_SUMIDO,
): AlunoSumido[] {
  const sumidos: AlunoSumido[] = [];

  for (const aluno of alunos) {
    if (aluno.status === "trancado") continue;
    const diasAusente = daysBetween(aluno.ultima_visita, refIso);
    if (diasAusente < thresholdDays) continue;
    sumidos.push({
      id: aluno.id,
      nome: aluno.nome,
      foto: aluno.foto,
      status: aluno.status,
      ultima_visita: aluno.ultima_visita,
      diasAusente,
    });
  }

  return sumidos.sort((a, b) => b.diasAusente - a.diasAusente);
}
