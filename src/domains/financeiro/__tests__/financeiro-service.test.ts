import { afterEach, describe, expect, test, vi } from "vitest";
import {
  diasAtraso,
  computeKpis,
  buildInadimplentes,
  buildDunningRegua,
  DUNNING_STAGES,
  getFinanceiroData,
  getInadimplenciaData,
} from "../services/financeiro-service";
import type { AlunoResumo, Fatura } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

const REF = new Date(2026, 6, 20); // 20/07/2026 (mês 6 = julho, 0-indexed)

function fatura(overrides: Partial<Fatura> = {}): Fatura {
  return {
    id: "ft-x",
    alunoId: "al-1",
    aluno: "Fulano",
    contratoId: "ct-1",
    competencia: "2026-07",
    vencimento: "2026-07-10",
    valor: 100,
    status: "vencida",
    meio: "pix",
    pago_em: null,
    tentativas_cobranca: 1,
    ultima_tentativa: "2026-07-15",
    ...overrides,
  };
}

afterEach(() => vi.clearAllMocks());

describe("diasAtraso", () => {
  test("conta os dias corridos desde o vencimento até a referência", () => {
    expect(diasAtraso("2026-07-10", REF)).toBe(10);
  });

  test("retorna 0 quando ainda não venceu", () => {
    expect(diasAtraso("2026-07-25", REF)).toBe(0);
  });

  test("retorna 0 no próprio dia do vencimento", () => {
    expect(diasAtraso("2026-07-20", REF)).toBe(0);
  });
});

describe("computeKpis", () => {
  const faturas: Fatura[] = [
    fatura({ id: "a", status: "paga", valor: 200 }),
    fatura({ id: "b", status: "paga", valor: 300 }),
    fatura({ id: "c", status: "aberta", valor: 150 }),
    fatura({ id: "d", status: "vencida", valor: 350 }),
  ];

  test("soma recebido, a receber e em atraso por status", () => {
    const kpis = computeKpis(faturas);
    expect(kpis.recebidoMes).toBe(500);
    expect(kpis.aReceber).toBe(150);
    expect(kpis.emAtraso).toBe(350);
  });

  test("conta a quantidade por status", () => {
    const kpis = computeKpis(faturas);
    expect(kpis.qtdPagas).toBe(2);
    expect(kpis.qtdAbertas).toBe(1);
    expect(kpis.qtdVencidas).toBe(1);
  });

  test("calcula a taxa de inadimplência como % do total faturado", () => {
    const kpis = computeKpis(faturas);
    // 350 / (500 + 150 + 350) = 350/1000 = 35%
    expect(kpis.taxaInadimplencia).toBe(35);
  });

  test("não divide por zero quando não há faturas", () => {
    expect(computeKpis([]).taxaInadimplencia).toBe(0);
  });
});

describe("buildInadimplentes", () => {
  const alunos: AlunoResumo[] = [
    {
      id: "al-1",
      nome: "Ana",
      email: "ana@x.com",
      telefone: "(41) 1",
      foto: "",
      status: "inadimplente",
      plano: "Mensal",
      planoId: "pl-1",
    },
  ];

  test("junta a fatura com o aluno e calcula dias de atraso", () => {
    const rows = buildInadimplentes([fatura({ alunoId: "al-1", vencimento: "2026-07-10" })], alunos, REF);
    expect(rows).toHaveLength(1);
    expect(rows[0].aluno?.nome).toBe("Ana");
    expect(rows[0].diasAtraso).toBe(10);
  });

  test("ordena do maior para o menor atraso", () => {
    const rows = buildInadimplentes(
      [
        fatura({ id: "novo", vencimento: "2026-07-18" }),
        fatura({ id: "antigo", vencimento: "2026-07-01" }),
      ],
      alunos,
      REF,
    );
    expect(rows.map((r) => r.fatura.id)).toEqual(["antigo", "novo"]);
  });

  test("mantém aluno nulo quando não há correspondência", () => {
    const rows = buildInadimplentes([fatura({ alunoId: "inexistente" })], alunos, REF);
    expect(rows[0].aluno).toBeNull();
  });
});

describe("buildDunningRegua", () => {
  const vencidas: Fatura[] = [
    fatura({ id: "v1", vencimento: "2026-07-19", valor: 100 }), // 1 dia
    fatura({ id: "v2", vencimento: "2026-07-16", valor: 100 }), // 4 dias
    fatura({ id: "v3", vencimento: "2026-07-13", valor: 100 }), // 7 dias
  ];

  test("expõe as 4 etapas da régua na ordem D+1..D+7", () => {
    const regua = buildDunningRegua(vencidas, REF);
    expect(regua.stages.map((s) => s.key)).toEqual(["D+1", "D+3", "D+5", "D+7"]);
    expect(DUNNING_STAGES).toHaveLength(4);
  });

  test("conta cumulativamente as faturas que atingiram cada etapa", () => {
    const regua = buildDunningRegua(vencidas, REF);
    const byKey = Object.fromEntries(regua.stages.map((s) => [s.key, s.atingidas]));
    expect(byKey["D+1"]).toBe(3); // todas com >=1 dia
    expect(byKey["D+3"]).toBe(2); // 4 e 7 dias
    expect(byKey["D+5"]).toBe(1); // só 7 dias
    expect(byKey["D+7"]).toBe(1);
  });

  test("soma o valor vencido total", () => {
    const regua = buildDunningRegua(vencidas, REF);
    expect(regua.valorVencido).toBe(300);
    expect(regua.qtdVencidas).toBe(3);
  });

  test("estima recuperação e risco coerentes (recuperável + risco = vencido)", () => {
    const regua = buildDunningRegua(vencidas, REF);
    expect(regua.recuperacaoEstimada + regua.valorEmRisco).toBeCloseTo(300, 2);
    expect(regua.recuperacaoEstimada).toBeGreaterThan(0);
    expect(regua.taxaRecuperacaoMedia).toBeGreaterThan(0);
    expect(regua.taxaRecuperacaoMedia).toBeLessThanOrEqual(100);
  });

  test("não quebra sem faturas vencidas", () => {
    const regua = buildDunningRegua([], REF);
    expect(regua.valorVencido).toBe(0);
    expect(regua.recuperacaoEstimada).toBe(0);
    expect(regua.taxaRecuperacaoMedia).toBe(0);
    expect(regua.stages).toHaveLength(4);
  });
});

describe("getFinanceiroData", () => {
  test("carrega faturas e planos em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "faturas") return [fatura()] as never;
      if (resource === "planos") return [{ id: "pl-1" }] as never;
      return [] as never;
    });

    const data = await getFinanceiroData();

    expect(apiClient.getList).toHaveBeenCalledWith("faturas");
    expect(apiClient.getList).toHaveBeenCalledWith("planos");
    expect(data.faturas).toHaveLength(1);
    expect(data.planos).toHaveLength(1);
  });
});

describe("getInadimplenciaData", () => {
  test("filtra faturas por status vencida e traz alunos", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "faturas") return [fatura({ status: "vencida" })] as never;
      if (resource === "alunos") return [{ id: "al-1" }] as never;
      return [] as never;
    });

    const data = await getInadimplenciaData();

    expect(apiClient.getList).toHaveBeenCalledWith("faturas", { status: "vencida" });
    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
    expect(data.faturasVencidas).toHaveLength(1);
    expect(data.alunos).toHaveLength(1);
  });
});
