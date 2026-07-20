import { apiClient } from "@/shared/lib/api-client";
import type {
  AlunoResumo,
  DunningRegua,
  DunningStageResult,
  Fatura,
  FinanceiroData,
  FinanceiroKpis,
  InadimplenciaData,
  InadimplenteRow,
  Plano,
} from "../types";

const MS_PER_DAY = 86_400_000;

/** Interpreta "aaaa-mm-dd" como data local (evita voltar 1 dia em UTC-3). */
function parseLocalDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Dias corridos de atraso de uma fatura (0 se ainda não venceu). */
export function diasAtraso(vencimento: string, ref: Date = new Date()): number {
  const venc = parseLocalDate(vencimento);
  if (Number.isNaN(venc.getTime())) return 0;
  const diff = Math.floor((startOfDay(ref).getTime() - startOfDay(venc).getTime()) / MS_PER_DAY);
  return Math.max(0, diff);
}

/** Agrega os KPIs financeiros a partir da lista de faturas. */
export function computeKpis(faturas: Fatura[]): FinanceiroKpis {
  const acc = faturas.reduce(
    (a, f) => {
      if (f.status === "paga") {
        a.recebidoMes += f.valor;
        a.qtdPagas += 1;
      } else if (f.status === "aberta") {
        a.aReceber += f.valor;
        a.qtdAbertas += 1;
      } else if (f.status === "vencida") {
        a.emAtraso += f.valor;
        a.qtdVencidas += 1;
      }
      return a;
    },
    { recebidoMes: 0, aReceber: 0, emAtraso: 0, qtdPagas: 0, qtdAbertas: 0, qtdVencidas: 0 },
  );

  const totalFaturado = acc.recebidoMes + acc.aReceber + acc.emAtraso;
  const taxaInadimplencia = totalFaturado > 0 ? Math.round((acc.emAtraso / totalFaturado) * 100) : 0;

  return { ...acc, taxaInadimplencia };
}

/** Junta faturas vencidas aos alunos e ordena pelo maior atraso. */
export function buildInadimplentes(
  faturasVencidas: Fatura[],
  alunos: AlunoResumo[],
  ref: Date = new Date(),
): InadimplenteRow[] {
  const byId = new Map(alunos.map((a) => [a.id, a]));
  return faturasVencidas
    .map((fatura) => ({
      fatura,
      aluno: byId.get(fatura.alunoId) ?? null,
      diasAtraso: diasAtraso(fatura.vencimento, ref),
    }))
    .sort((a, b) => b.diasAtraso - a.diasAtraso);
}

/**
 * Régua de cobrança (dunning). Cada etapa dispara em um marco de dias de atraso
 * e traz uma taxa de recuperação de referência (benchmark) decrescente.
 */
export const DUNNING_STAGES: ReadonlyArray<{
  key: string;
  dia: number;
  titulo: string;
  acao: string;
  taxaRecuperacao: number;
}> = [
  { key: "D+1", dia: 1, titulo: "Lembrete amigável", acao: "WhatsApp automático", taxaRecuperacao: 0.45 },
  { key: "D+3", dia: 3, titulo: "Cobrança", acao: "E-mail + SMS com 2ª via", taxaRecuperacao: 0.3 },
  { key: "D+5", dia: 5, titulo: "Aviso", acao: "Ligação da recepção", taxaRecuperacao: 0.18 },
  { key: "D+7", dia: 7, titulo: "Escalonamento", acao: "Bloqueio de acesso na catraca", taxaRecuperacao: 0.08 },
];

/** Etapa de dunning atual (mais avançada) atingida por uma dada quantidade de dias. */
function currentStage(dias: number) {
  let stage = null as (typeof DUNNING_STAGES)[number] | null;
  for (const s of DUNNING_STAGES) {
    if (dias >= s.dia) stage = s;
  }
  return stage;
}

/** Monta a régua de dunning com contagens reais e projeção de recuperação. */
export function buildDunningRegua(faturasVencidas: Fatura[], ref: Date = new Date()): DunningRegua {
  const comAtraso = faturasVencidas.map((f) => ({ fatura: f, dias: diasAtraso(f.vencimento, ref) }));

  const stages: DunningStageResult[] = DUNNING_STAGES.map((s) => {
    const atingidasFaturas = comAtraso.filter((c) => c.dias >= s.dia);
    return {
      key: s.key,
      dia: s.dia,
      titulo: s.titulo,
      acao: s.acao,
      taxaRecuperacao: s.taxaRecuperacao,
      atingidas: atingidasFaturas.length,
      valorAtingido: atingidasFaturas.reduce((sum, c) => sum + c.fatura.valor, 0),
    };
  });

  const valorVencido = comAtraso.reduce((sum, c) => sum + c.fatura.valor, 0);
  const recuperacaoEstimada = comAtraso.reduce((sum, c) => {
    const stage = currentStage(c.dias);
    return sum + (stage ? c.fatura.valor * stage.taxaRecuperacao : 0);
  }, 0);
  const valorEmRisco = valorVencido - recuperacaoEstimada;
  const taxaRecuperacaoMedia = valorVencido > 0 ? Math.round((recuperacaoEstimada / valorVencido) * 100) : 0;

  return {
    stages,
    qtdVencidas: faturasVencidas.length,
    valorVencido,
    recuperacaoEstimada,
    valorEmRisco,
    taxaRecuperacaoMedia,
  };
}

/** Carrega os dados da tela /financeiro (faturas + planos) em paralelo. */
export async function getFinanceiroData(): Promise<FinanceiroData> {
  const [faturas, planos] = await Promise.all([
    apiClient.getList<Fatura>("faturas"),
    apiClient.getList<Plano>("planos"),
  ]);
  return { faturas, planos };
}

/** Carrega os dados da inadimplência (faturas vencidas + alunos) em paralelo. */
export async function getInadimplenciaData(): Promise<InadimplenciaData> {
  const [faturasVencidas, alunos] = await Promise.all([
    apiClient.getList<Fatura>("faturas", { status: "vencida" }),
    apiClient.getList<AlunoResumo>("alunos"),
  ]);
  return { faturasVencidas, alunos };
}
