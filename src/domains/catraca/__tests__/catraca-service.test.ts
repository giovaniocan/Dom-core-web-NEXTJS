import { afterEach, describe, expect, test, vi } from "vitest";
import {
  loadCatracaData,
  computePresence,
  ocupacaoPct,
  recentPasses,
  buildTerminals,
  contagemDoDia,
  buildHeatmap,
  peakHour,
  frequencyByAluno,
  alunosSumidos,
  latestTimestamp,
  occupancyByUnidade,
} from "../services/catraca-service";
import type { Acesso, AlunoLite, Unidade } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

function mk(
  id: string,
  alunoId: string,
  aluno: string,
  unidadeId: string,
  terminal: string,
  sentido: Acesso["sentido"],
  resultado: Acesso["resultado"],
  motivo: string | null,
  timestamp: string,
): Acesso {
  return {
    id,
    alunoId,
    aluno,
    foto: "",
    unidadeId,
    terminal,
    sentido,
    resultado,
    motivo,
    timestamp,
  };
}

const acessos: Acesso[] = [
  mk("a1", "al-1", "Ana", "un-1", "Cat 01", "entrada", "liberado", null, "2026-07-20T10:00:00.000Z"),
  mk("a2", "al-1", "Ana", "un-1", "Cat 01", "saida", "liberado", null, "2026-07-20T11:00:00.000Z"),
  mk("a3", "al-2", "Bruno", "un-1", "Cat 02", "entrada", "liberado", null, "2026-07-20T12:00:00.000Z"),
  mk("a4", "al-3", "Caetano", "un-2", "Cat B1", "entrada", "liberado", null, "2026-07-20T09:00:00.000Z"),
  mk("a5", "al-4", "Duda", "un-1", "Cat 01", "entrada", "negado", "Fatura vencida", "2026-07-20T12:30:00.000Z"),
];

const alunos: AlunoLite[] = [
  { id: "al-1", nome: "Ana", foto: "", status: "ativo", plano: "Black", unidadeId: "un-1", ultima_visita: "2026-07-18" },
  { id: "al-2", nome: "Bruno", foto: "", status: "ativo", plano: "Fit", unidadeId: "un-1", ultima_visita: "2026-07-10" },
  { id: "al-3", nome: "Caetano", foto: "", status: "trancado", plano: "Fit", unidadeId: "un-2", ultima_visita: "2026-06-01" },
  { id: "al-4", nome: "Duda", foto: "", status: "inadimplente", plano: "Fit", unidadeId: "un-1", ultima_visita: "2026-07-01" },
  { id: "al-5", nome: "Eva", foto: "", status: "ativo", plano: "Fit", unidadeId: "un-1", ultima_visita: "2026-07-19" },
];

afterEach(() => vi.clearAllMocks());

describe("loadCatracaData", () => {
  test("busca acessos, alunos e unidades em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "acessos") return acessos as never;
      if (resource === "alunos") return alunos as never;
      if (resource === "unidades") return [] as never;
      return [] as never;
    });

    const data = await loadCatracaData();

    expect(apiClient.getList).toHaveBeenCalledWith("acessos");
    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
    expect(apiClient.getList).toHaveBeenCalledWith("unidades");
    expect(data.acessos).toHaveLength(5);
    expect(data.alunos).toHaveLength(5);
  });
});

describe("computePresence", () => {
  test("retorna somente quem tem última passagem liberada = entrada, ordenado por entrada mais recente", () => {
    const presentes = computePresence(acessos);
    expect(presentes.map((p) => p.alunoId)).toEqual(["al-2", "al-3"]);
    expect(presentes[0].desde).toBe("2026-07-20T12:00:00.000Z");
  });

  test("ignora passagens negadas (catraca não gira)", () => {
    const presentes = computePresence(acessos);
    expect(presentes.some((p) => p.alunoId === "al-4")).toBe(false);
  });

  test("aluno que entrou e saiu não está presente", () => {
    const presentes = computePresence(acessos);
    expect(presentes.some((p) => p.alunoId === "al-1")).toBe(false);
  });
});

describe("ocupacaoPct", () => {
  test("calcula o percentual de ocupação", () => {
    expect(ocupacaoPct(2, 100)).toBe(2);
    expect(ocupacaoPct(50, 200)).toBe(25);
  });

  test("limita em 100% e trata capacidade zero", () => {
    expect(ocupacaoPct(150, 100)).toBe(100);
    expect(ocupacaoPct(5, 0)).toBe(0);
  });
});

describe("recentPasses", () => {
  test("retorna as passagens mais recentes primeiro, respeitando o limite", () => {
    const passes = recentPasses(acessos, 2);
    expect(passes.map((p) => p.id)).toEqual(["a5", "a3"]);
  });
});

describe("latestTimestamp", () => {
  test("retorna o timestamp mais recente da coleção", () => {
    expect(latestTimestamp(acessos)).toBe("2026-07-20T12:30:00.000Z");
  });

  test("retorna null para coleção vazia", () => {
    expect(latestTimestamp([])).toBeNull();
  });
});

describe("buildTerminals", () => {
  test("agrupa por terminal com última atividade, total e status online", () => {
    const terminais = buildTerminals(acessos, "2026-07-20T12:35:00.000Z", 180);
    const byName = Object.fromEntries(terminais.map((t) => [t.terminal, t]));

    expect(byName["Cat 01"].totalPassagens).toBe(3);
    expect(byName["Cat 01"].online).toBe(true);
    expect(byName["Cat B1"].totalPassagens).toBe(1);
    // Cat B1 última atividade 09:00, agora 12:35 → 215min > 180 → offline
    expect(byName["Cat B1"].online).toBe(false);
  });
});

describe("contagemDoDia", () => {
  test("conta liberados e negados do dia de referência", () => {
    const c = contagemDoDia(acessos, "2026-07-20T23:00:00.000Z");
    expect(c.liberados).toBe(4);
    expect(c.negados).toBe(1);
    expect(c.total).toBe(5);
  });
});

describe("buildHeatmap", () => {
  test("conta apenas entradas liberadas por dia da semana × hora (UTC)", () => {
    const { grid, max } = buildHeatmap(acessos);
    // 2026-07-20 = segunda (getUTCDay = 1)
    expect(grid[1][9]).toBe(1);
    expect(grid[1][10]).toBe(1);
    expect(grid[1][12]).toBe(1);
    expect(max).toBe(1);
  });
});

describe("peakHour", () => {
  test("retorna a hora com mais entradas", () => {
    const peak = peakHour(acessos);
    expect(peak?.total).toBe(1);
  });

  test("retorna null quando não há entradas", () => {
    expect(peakHour([])).toBeNull();
  });
});

describe("frequencyByAluno", () => {
  test("conta entradas liberadas por aluno e exclui quem nunca entrou", () => {
    const freq = frequencyByAluno(acessos, alunos);
    expect(freq.map((f) => f.alunoId)).toEqual(["al-1", "al-2", "al-3"]);
    expect(freq.every((f) => f.entradas === 1)).toBe(true);
    expect(freq[0].ultimaEntrada).toBe("2026-07-20T10:00:00.000Z");
  });
});

describe("alunosSumidos", () => {
  test("lista não-trancados ausentes além do limite, ordenados por dias ausente desc", () => {
    const sumidos = alunosSumidos(alunos, "2026-07-20", 5);
    expect(sumidos.map((s) => s.id)).toEqual(["al-4", "al-2"]);
    expect(sumidos[0].diasAusente).toBe(19);
    expect(sumidos[1].diasAusente).toBe(10);
  });

  test("exclui alunos trancados mesmo ausentes há muito tempo", () => {
    const sumidos = alunosSumidos(alunos, "2026-07-20", 5);
    expect(sumidos.some((s) => s.id === "al-3")).toBe(false);
  });
});

describe("occupancyByUnidade", () => {
  const unidades: Unidade[] = [
    { id: "un-1", nome: "Unidade Centro", endereco: "", capacidade: 100, catracas: 2 },
    { id: "un-2", nome: "Unidade Batel", endereco: "", capacidade: 50, catracas: 1 },
  ];

  test("conta presentes por unidade e calcula percentual sobre a capacidade", () => {
    const presentes = computePresence(acessos); // al-2 (un-1), al-3 (un-2)
    const ocup = occupancyByUnidade(presentes, unidades);
    const byId = Object.fromEntries(ocup.map((o) => [o.unidadeId, o]));

    expect(byId["un-1"].dentro).toBe(1);
    expect(byId["un-1"].pct).toBe(1);
    expect(byId["un-2"].dentro).toBe(1);
    expect(byId["un-2"].pct).toBe(2);
  });

  test("mantém unidades sem ninguém dentro com dentro=0", () => {
    const ocup = occupancyByUnidade([], unidades);
    expect(ocup).toHaveLength(2);
    expect(ocup.every((o) => o.dentro === 0 && o.pct === 0)).toBe(true);
    expect(ocup.map((o) => o.nome)).toEqual(["Unidade Centro", "Unidade Batel"]);
  });
});
