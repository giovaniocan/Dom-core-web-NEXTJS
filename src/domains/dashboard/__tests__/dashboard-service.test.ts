import { afterEach, describe, expect, test, vi } from "vitest";
import { getDashboard, pickPodium, revenueProgress } from "../services/dashboard-service";
import type { DashboardSnapshot, RankingEntry } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

const snapshot: DashboardSnapshot = {
  id: "atual",
  kpis: {
    alunosAtivos: 182,
    alunosAtivosDelta: "+6%",
    checkinsHoje: 74,
    inadimplentes: 9,
    aReceber: 4230,
    novosNoMes: 12,
    novosNoMesDelta: "+3",
    ocupacaoPct: 68,
  },
  frequenciaSemana: [{ dia: "Seg", entradas: 90 }],
  receitaMes: { total: 32000, meta: 40000 },
  ranking: [],
  pendencias: [],
};

afterEach(() => vi.clearAllMocks());

describe("getDashboard", () => {
  test("retorna o primeiro snapshot da coleção 'dashboard'", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue([snapshot]);

    const result = await getDashboard();

    expect(apiClient.getList).toHaveBeenCalledWith("dashboard");
    expect(result).toEqual(snapshot);
  });

  test("lança erro claro quando não há snapshot", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue([]);
    await expect(getDashboard()).rejects.toThrow(/dashboard/i);
  });
});

describe("pickPodium", () => {
  const ranking: RankingEntry[] = [
    { posicao: 2, alunoId: "b", nome: "Bruno", xp: 800, streak: 5 },
    { posicao: 1, alunoId: "a", nome: "Ana", xp: 1200, streak: 12 },
    { posicao: 4, alunoId: "d", nome: "Duda", xp: 400, streak: 2 },
    { posicao: 3, alunoId: "c", nome: "Caio", xp: 600, streak: 3 },
  ];

  test("retorna os 3 primeiros ordenados por posição", () => {
    const podium = pickPodium(ranking);
    expect(podium.map((r) => r.nome)).toEqual(["Ana", "Bruno", "Caio"]);
  });

  test("não quebra com ranking menor que 3", () => {
    expect(pickPodium(ranking.slice(0, 1))).toHaveLength(1);
  });
});

describe("revenueProgress", () => {
  test("calcula o percentual da meta", () => {
    expect(revenueProgress({ total: 20000, meta: 40000 })).toBe(50);
  });

  test("limita em 100% quando ultrapassa a meta", () => {
    expect(revenueProgress({ total: 50000, meta: 40000 })).toBe(100);
  });

  test("retorna 0 quando a meta é 0 (evita divisão por zero)", () => {
    expect(revenueProgress({ total: 1000, meta: 0 })).toBe(0);
  });
});
