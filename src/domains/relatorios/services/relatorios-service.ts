import { apiClient } from "@/shared/lib/api-client";
import type {
  Acesso,
  AlunoResumo,
  Contrato,
  Fatura,
  FrequenciaDia,
  ReceitaCompetencia,
  RelatoriosData,
  RelatoriosKpis,
} from "../types";

/** Arredonda para 1 casa decimal (percentuais de KPI). */
const round1 = (n: number): number => Math.round(n * 10) / 10;

/** Zero-pad numérico para compor chaves de dia "aaaa-mm-dd". */
const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * MRR — Receita Recorrente Mensal.
 * Soma de `valor_mensal` dos contratos com status "ativo".
 */
export function mrr(contratos: Contrato[]): number {
  return contratos
    .filter((c) => c.status === "ativo")
    .reduce((sum, c) => sum + c.valor_mensal, 0);
}

/**
 * % de inadimplência por quantidade de faturas:
 * vencidas / (vencidas + pagas + abertas) × 100. Arredonda a 1 casa.
 */
export function percentInadimplencia(faturas: Fatura[]): number {
  const conta = { vencida: 0, paga: 0, aberta: 0 };
  for (const f of faturas) {
    if (f.status === "vencida") conta.vencida += 1;
    else if (f.status === "paga") conta.paga += 1;
    else if (f.status === "aberta") conta.aberta += 1;
  }
  const total = conta.vencida + conta.paga + conta.aberta;
  if (total === 0) return 0;
  return round1((conta.vencida / total) * 100);
}

/** Quantidade de alunos com status "ativo". */
export function alunosAtivos(alunos: AlunoResumo[]): number {
  return alunos.filter((a) => a.status === "ativo").length;
}

/** % de churn: contratos cancelados / total × 100. Arredonda a 1 casa. */
export function churn(contratos: Contrato[]): number {
  if (contratos.length === 0) return 0;
  const cancelados = contratos.filter((c) => c.status === "cancelado").length;
  return round1((cancelados / contratos.length) * 100);
}

/**
 * Receita reconhecida (faturas pagas) somada por competência,
 * ordenada crescentemente pela competência ("aaaa-mm"). Para o BarChart.
 */
export function receitaPorCompetencia(faturas: Fatura[]): ReceitaCompetencia[] {
  const porComp = new Map<string, number>();
  for (const f of faturas) {
    if (f.status !== "paga") continue;
    porComp.set(f.competencia, (porComp.get(f.competencia) ?? 0) + f.valor);
  }
  return [...porComp.entries()]
    .map(([competencia, total]) => ({ competencia, total }))
    .sort((a, b) => a.competencia.localeCompare(b.competencia));
}

/**
 * Entradas liberadas (sentido "entrada" + resultado "liberado") contadas por
 * dia de calendário local, ordenadas cronologicamente. `dia` = "aaaa-mm-dd".
 * Timestamps ISO são interpretados via Date e agrupados pelo dia local.
 * Para o LineChart.
 */
export function frequenciaPorDia(acessos: Acesso[]): FrequenciaDia[] {
  const porDia = new Map<string, number>();
  for (const a of acessos) {
    if (a.sentido !== "entrada" || a.resultado !== "liberado") continue;
    const d = new Date(a.timestamp);
    if (Number.isNaN(d.getTime())) continue;
    const dia = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
  }
  return [...porDia.entries()]
    .map(([dia, entradas]) => ({ dia, entradas }))
    .sort((a, b) => a.dia.localeCompare(b.dia));
}

/** Compõe os KPIs de negócio a partir das 4 coleções carregadas. */
export function computeKpis(data: RelatoriosData): RelatoriosKpis {
  return {
    mrr: mrr(data.contratos),
    alunosAtivos: alunosAtivos(data.alunos),
    percentInadimplencia: percentInadimplencia(data.faturas),
    churn: churn(data.contratos),
  };
}

/** Carrega as 4 coleções da tela /relatorios em paralelo. */
export async function getRelatoriosData(): Promise<RelatoriosData> {
  const [faturas, acessos, alunos, contratos] = await Promise.all([
    apiClient.getList<Fatura>("faturas"),
    apiClient.getList<Acesso>("acessos"),
    apiClient.getList<AlunoResumo>("alunos"),
    apiClient.getList<Contrato>("contratos"),
  ]);
  return { faturas, acessos, alunos, contratos };
}
