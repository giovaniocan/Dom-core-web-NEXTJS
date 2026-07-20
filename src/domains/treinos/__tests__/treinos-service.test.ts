import { afterEach, describe, expect, test, vi } from "vitest";
import {
  gruposMusculares,
  resolveFichaItens,
  getTreinosData,
} from "../services/treinos-service";
import type { Exercicio, Ficha } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

const exercicios: Exercicio[] = [
  { id: "ex-1", nome: "Supino reto", grupo: "Peito", equipamento: "Barra" },
  { id: "ex-2", nome: "Agachamento livre", grupo: "Pernas", equipamento: "Barra" },
  { id: "ex-3", nome: "Puxada frente", grupo: "Costas", equipamento: "Polia" },
  { id: "ex-6", nome: "Leg press 45", grupo: "Pernas", equipamento: "Máquina" },
];

function ficha(overrides: Partial<Ficha> = {}): Ficha {
  return {
    id: "fi-1",
    alunoId: "al-1",
    nome: "Full Body A",
    objetivo: "hipertrofia",
    professor: "Rafael Souza",
    itens: [
      { exercicioId: "ex-1", series: 4, reps: "10", carga_kg: 40 },
      { exercicioId: "ex-2", series: 4, reps: "12", carga_kg: 60 },
    ],
    ...overrides,
  };
}

afterEach(() => vi.clearAllMocks());

describe("gruposMusculares", () => {
  test("retorna os grupos distintos em ordem alfabética", () => {
    expect(gruposMusculares(exercicios)).toEqual(["Costas", "Peito", "Pernas"]);
  });

  test("remove duplicados (Pernas aparece uma única vez)", () => {
    const grupos = gruposMusculares(exercicios);
    expect(grupos.filter((g) => g === "Pernas")).toHaveLength(1);
  });

  test("retorna lista vazia sem exercícios", () => {
    expect(gruposMusculares([])).toEqual([]);
  });
});

describe("resolveFichaItens", () => {
  test("resolve cada exercicioId para o nome e o grupo do exercício", () => {
    const itens = resolveFichaItens(ficha(), exercicios);
    expect(itens).toHaveLength(2);
    expect(itens[0].nome).toBe("Supino reto");
    expect(itens[0].grupo).toBe("Peito");
    expect(itens[1].nome).toBe("Agachamento livre");
    expect(itens[1].grupo).toBe("Pernas");
  });

  test("preserva series, reps e carga_kg do item original", () => {
    const itens = resolveFichaItens(ficha(), exercicios);
    expect(itens[0]).toMatchObject({ series: 4, reps: "10", carga_kg: 40 });
  });

  test("usa o próprio id como fallback quando o exercício não existe", () => {
    const itens = resolveFichaItens(
      ficha({ itens: [{ exercicioId: "ex-999", series: 3, reps: "8", carga_kg: 20 }] }),
      exercicios,
    );
    expect(itens[0].nome).toBe("ex-999");
    expect(itens[0].grupo).toBe("—");
  });
});

describe("getTreinosData", () => {
  test("carrega exercicios e fichas em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "exercicios") return exercicios as never;
      if (resource === "fichas") return [ficha()] as never;
      return [] as never;
    });

    const data = await getTreinosData();

    expect(apiClient.getList).toHaveBeenCalledWith("exercicios");
    expect(apiClient.getList).toHaveBeenCalledWith("fichas");
    expect(data.exercicios).toHaveLength(4);
    expect(data.fichas).toHaveLength(1);
  });
});
