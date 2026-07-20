import { afterEach, describe, expect, test, vi } from "vitest";
import { ordenarRanking, podium, getGamificacaoData } from "../services/gamificacao-service";
import type { Conquista, GamificacaoConfig, RankingEntry, Recompensa } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

function entry(overrides: Partial<RankingEntry> = {}): RankingEntry {
  return {
    id: "rk-x",
    posicao: 1,
    alunoId: "al-1",
    nome: "Fulano",
    xp: 100,
    streak: 3,
    ...overrides,
  };
}

const config: GamificacaoConfig = {
  id: "atual",
  xpPorTreino: 50,
  foguinhosPorTreino: 1,
  bonusStreak: 10,
  marcos: [7, 14, 30, 60],
  catalogoResgatavel: true,
};

afterEach(() => vi.clearAllMocks());

describe("ordenarRanking", () => {
  test("ordena do maior para o menor XP", () => {
    const desordenado = [
      entry({ id: "a", xp: 100 }),
      entry({ id: "b", xp: 4122 }),
      entry({ id: "c", xp: 2378 }),
    ];
    const ordenado = ordenarRanking(desordenado);
    expect(ordenado.map((r) => r.id)).toEqual(["b", "c", "a"]);
    expect(ordenado.map((r) => r.xp)).toEqual([4122, 2378, 100]);
  });

  test("não muta o array original", () => {
    const original = [entry({ id: "a", xp: 10 }), entry({ id: "b", xp: 20 })];
    ordenarRanking(original);
    expect(original.map((r) => r.id)).toEqual(["a", "b"]);
  });

  test("retorna lista vazia quando não há ranking", () => {
    expect(ordenarRanking([])).toEqual([]);
  });
});

describe("podium", () => {
  const ranking = [
    entry({ id: "a", xp: 100 }),
    entry({ id: "b", xp: 4122 }),
    entry({ id: "c", xp: 2378 }),
    entry({ id: "d", xp: 3132 }),
    entry({ id: "e", xp: 90 }),
  ];

  test("retorna os 3 primeiros por XP em ordem decrescente", () => {
    const top = podium(ranking);
    expect(top).toHaveLength(3);
    expect(top.map((r) => r.id)).toEqual(["b", "d", "c"]);
  });

  test("retorna todos quando há menos de 3", () => {
    const top = podium([entry({ id: "x", xp: 50 })]);
    expect(top).toHaveLength(1);
    expect(top[0].id).toBe("x");
  });
});

describe("getGamificacaoData", () => {
  test("carrega ranking, recompensas, conquistas e config", async () => {
    const ranking: RankingEntry[] = [entry()];
    const recompensas: Recompensa[] = [
      { id: "rw-1", nome: "Camiseta", custo_xp: 2500, estoque: 30, categoria: "produto" },
    ];
    const conquistas: Conquista[] = [
      { id: "cq-1", titulo: "Primeiro Treino", descricao: "...", icone: "Dumbbell", criterio: "treinos >= 1" },
    ];

    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "ranking") return ranking as never;
      if (resource === "recompensas") return recompensas as never;
      if (resource === "conquistas") return conquistas as never;
      if (resource === "gamificacao_config") return config as never;
      return [] as never;
    });

    const data = await getGamificacaoData();

    expect(apiClient.getList).toHaveBeenCalledWith("ranking");
    expect(apiClient.getList).toHaveBeenCalledWith("recompensas");
    expect(apiClient.getList).toHaveBeenCalledWith("conquistas");
    expect(apiClient.getList).toHaveBeenCalledWith("gamificacao_config");
    expect(data.ranking).toHaveLength(1);
    expect(data.recompensas).toHaveLength(1);
    expect(data.conquistas).toHaveLength(1);
    expect(data.config.xpPorTreino).toBe(50);
    expect(data.config.marcos).toEqual([7, 14, 30, 60]);
  });
});
