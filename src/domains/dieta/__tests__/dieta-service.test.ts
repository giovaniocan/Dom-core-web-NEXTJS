import { afterEach, describe, expect, test, vi } from "vitest";
import { somaMacros, adesao, getDietaData } from "../services/dieta-service";
import type { Refeicao } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

function refeicao(overrides: Partial<Refeicao> = {}): Refeicao {
  return {
    nome: "Refeição",
    horario: "08:00",
    itens: ["Item"],
    kcal: 100,
    proteina: 10,
    carbo: 20,
    gordura: 5,
    feito: false,
    ...overrides,
  };
}

afterEach(() => vi.clearAllMocks());

describe("somaMacros", () => {
  test("soma os macros de todas as refeições", () => {
    const soma = somaMacros([
      refeicao({ kcal: 420, proteina: 26, carbo: 42, gordura: 15 }),
      refeicao({ kcal: 620, proteina: 48, carbo: 65, gordura: 16 }),
      refeicao({ kcal: 320, proteina: 18, carbo: 45, gordura: 9 }),
    ]);
    expect(soma.kcal).toBe(1360);
    expect(soma.proteina).toBe(92);
    expect(soma.carbo).toBe(152);
    expect(soma.gordura).toBe(40);
  });

  test("retorna zeros quando não há refeições", () => {
    expect(somaMacros([])).toEqual({ kcal: 0, proteina: 0, carbo: 0, gordura: 0 });
  });
});

describe("adesao", () => {
  test("conta refeições feitas, total e percentual", () => {
    const a = adesao([
      refeicao({ feito: true }),
      refeicao({ feito: true }),
      refeicao({ feito: false }),
      refeicao({ feito: false }),
    ]);
    expect(a.feitas).toBe(2);
    expect(a.total).toBe(4);
    expect(a.percent).toBe(50);
  });

  test("arredonda o percentual", () => {
    const a = adesao([
      refeicao({ feito: true }),
      refeicao({ feito: false }),
      refeicao({ feito: false }),
    ]);
    expect(a.percent).toBe(33);
  });

  test("protege contra divisão por zero (total 0 → 0%)", () => {
    expect(adesao([])).toEqual({ feitas: 0, total: 0, percent: 0 });
  });
});

describe("getDietaData", () => {
  test("carrega planos, alunos e profissionais em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "planos_alimentares") return [{ id: "pa-1" }] as never;
      if (resource === "alunos") return [{ id: "al-1" }] as never;
      if (resource === "profissionais") return [{ id: "pr-2" }] as never;
      return [] as never;
    });

    const data = await getDietaData();

    expect(apiClient.getList).toHaveBeenCalledWith("planos_alimentares");
    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
    expect(apiClient.getList).toHaveBeenCalledWith("profissionais");
    expect(data.planos).toHaveLength(1);
    expect(data.alunos).toHaveLength(1);
    expect(data.profissionais).toHaveLength(1);
  });
});
