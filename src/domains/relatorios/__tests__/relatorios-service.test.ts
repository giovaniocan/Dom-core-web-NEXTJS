import { afterEach, describe, expect, test, vi } from "vitest";
import {
  mrr,
  percentInadimplencia,
  alunosAtivos,
  churn,
  receitaPorCompetencia,
  frequenciaPorDia,
  computeKpis,
  getRelatoriosData,
} from "../services/relatorios-service";
import type { Acesso, AlunoResumo, Contrato, Fatura } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

afterEach(() => vi.clearAllMocks());

function contrato(overrides: Partial<Contrato> = {}): Contrato {
  return {
    id: "ct-x",
    alunoId: "al-1",
    planoId: "pl-1",
    inicio: "2025-08-18",
    fim: "2026-08-18",
    status: "ativo",
    valor_mensal: 100,
    ...overrides,
  };
}

function fatura(overrides: Partial<Fatura> = {}): Fatura {
  return {
    id: "ft-x",
    alunoId: "al-1",
    competencia: "2026-07",
    vencimento: "2026-07-10",
    valor: 100,
    status: "paga",
    pago_em: "2026-07-05",
    meio: "pix",
    ...overrides,
  };
}

function aluno(overrides: Partial<AlunoResumo> = {}): AlunoResumo {
  return { id: "al-x", nome: "Fulano", status: "ativo", matricula: "2025-01-01", ...overrides };
}

/** Cria um timestamp ISO a partir de uma data/hora LOCAL — determinístico em qualquer timezone. */
const isoLocal = (y: number, m: number, d: number, h = 12): string =>
  new Date(y, m - 1, d, h).toISOString();

function acesso(overrides: Partial<Acesso> = {}): Acesso {
  return {
    id: "ac-x",
    alunoId: "al-1",
    sentido: "entrada",
    resultado: "liberado",
    timestamp: isoLocal(2026, 7, 20),
    ...overrides,
  };
}

describe("mrr", () => {
  test("soma valor_mensal apenas dos contratos com status ativo", () => {
    const contratos = [
      contrato({ id: "a", status: "ativo", valor_mensal: 99.9 }),
      contrato({ id: "b", status: "ativo", valor_mensal: 129.9 }),
      contrato({ id: "c", status: "cancelado", valor_mensal: 349.9 }),
      contrato({ id: "d", status: "em_atraso", valor_mensal: 200 }),
    ];
    expect(mrr(contratos)).toBeCloseTo(229.8, 2);
  });

  test("retorna 0 sem contratos", () => {
    expect(mrr([])).toBe(0);
  });
});

describe("percentInadimplencia", () => {
  test("calcula vencidas / (vencidas + pagas + abertas) × 100", () => {
    const faturas = [
      fatura({ status: "vencida" }),
      fatura({ status: "vencida" }),
      fatura({ status: "vencida" }),
      fatura({ status: "paga" }),
      fatura({ status: "paga" }),
      fatura({ status: "paga" }),
      fatura({ status: "paga" }),
      fatura({ status: "paga" }),
      fatura({ status: "aberta" }),
      fatura({ status: "aberta" }),
    ];
    // 3 vencidas / 10 totais = 30%
    expect(percentInadimplencia(faturas)).toBe(30);
  });

  test("não divide por zero sem faturas", () => {
    expect(percentInadimplencia([])).toBe(0);
  });
});

describe("alunosAtivos", () => {
  test("conta apenas alunos com status ativo", () => {
    const alunos = [
      aluno({ id: "1", status: "ativo" }),
      aluno({ id: "2", status: "inadimplente" }),
      aluno({ id: "3", status: "ativo" }),
      aluno({ id: "4", status: "trancado" }),
    ];
    expect(alunosAtivos(alunos)).toBe(2);
  });
});

describe("churn", () => {
  test("calcula contratos cancelados / total × 100", () => {
    const contratos = [
      contrato({ status: "cancelado" }),
      contrato({ status: "ativo" }),
      contrato({ status: "ativo" }),
      contrato({ status: "ativo" }),
    ];
    expect(churn(contratos)).toBe(25);
  });

  test("retorna 0 sem contratos", () => {
    expect(churn([])).toBe(0);
  });
});

describe("receitaPorCompetencia", () => {
  test("soma faturas pagas por competência e ordena crescentemente", () => {
    const faturas = [
      fatura({ competencia: "2026-08", status: "paga", valor: 100 }),
      fatura({ competencia: "2026-06", status: "paga", valor: 200 }),
      fatura({ competencia: "2026-06", status: "paga", valor: 50 }),
      fatura({ competencia: "2026-07", status: "paga", valor: 300 }),
      fatura({ competencia: "2026-07", status: "vencida", valor: 999 }), // ignorada
      fatura({ competencia: "2026-07", status: "aberta", valor: 999 }), // ignorada
    ];
    expect(receitaPorCompetencia(faturas)).toEqual([
      { competencia: "2026-06", total: 250 },
      { competencia: "2026-07", total: 300 },
      { competencia: "2026-08", total: 100 },
    ]);
  });

  test("retorna lista vazia sem faturas pagas", () => {
    expect(receitaPorCompetencia([fatura({ status: "vencida" })])).toEqual([]);
  });
});

describe("frequenciaPorDia", () => {
  test("conta entradas liberadas por dia local e ordena cronologicamente", () => {
    const acessos = [
      acesso({ id: "1", timestamp: isoLocal(2026, 7, 20, 8) }),
      acesso({ id: "2", timestamp: isoLocal(2026, 7, 20, 19) }),
      acesso({ id: "3", timestamp: isoLocal(2026, 7, 21, 10) }),
      acesso({ id: "4", sentido: "saida", timestamp: isoLocal(2026, 7, 20, 9) }), // saída ignorada
      acesso({ id: "5", resultado: "negado", timestamp: isoLocal(2026, 7, 20, 9) }), // negado ignorado
    ];
    expect(frequenciaPorDia(acessos)).toEqual([
      { dia: "2026-07-20", entradas: 2 },
      { dia: "2026-07-21", entradas: 1 },
    ]);
  });

  test("retorna lista vazia sem entradas liberadas", () => {
    expect(frequenciaPorDia([])).toEqual([]);
  });
});

describe("computeKpis", () => {
  test("compõe mrr, alunosAtivos, inadimplência e churn a partir das coleções", () => {
    const kpis = computeKpis({
      faturas: [fatura({ status: "vencida" }), fatura({ status: "paga" })],
      acessos: [],
      alunos: [aluno({ status: "ativo" }), aluno({ status: "trancado" })],
      contratos: [contrato({ status: "ativo", valor_mensal: 150 })],
    });
    expect(kpis.mrr).toBe(150);
    expect(kpis.alunosAtivos).toBe(1);
    expect(kpis.percentInadimplencia).toBe(50);
    expect(kpis.churn).toBe(0);
  });
});

describe("getRelatoriosData", () => {
  test("carrega faturas, acessos, alunos e contratos em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "faturas") return [fatura()] as never;
      if (resource === "acessos") return [acesso()] as never;
      if (resource === "alunos") return [aluno()] as never;
      if (resource === "contratos") return [contrato()] as never;
      return [] as never;
    });

    const data = await getRelatoriosData();

    expect(apiClient.getList).toHaveBeenCalledWith("faturas");
    expect(apiClient.getList).toHaveBeenCalledWith("acessos");
    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
    expect(apiClient.getList).toHaveBeenCalledWith("contratos");
    expect(data.faturas).toHaveLength(1);
    expect(data.acessos).toHaveLength(1);
    expect(data.alunos).toHaveLength(1);
    expect(data.contratos).toHaveLength(1);
  });
});
