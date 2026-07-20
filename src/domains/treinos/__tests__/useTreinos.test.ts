import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTreinos } from "../hooks/useTreinos";
import { getTreinosData } from "../services/treinos-service";
import type { TreinosData } from "../types";

vi.mock("../services/treinos-service", () => ({
  getTreinosData: vi.fn(),
}));

const payload: TreinosData = {
  exercicios: [{ id: "ex-1", nome: "Supino reto", grupo: "Peito", equipamento: "Barra" }],
  fichas: [
    {
      id: "fi-1",
      alunoId: "al-1",
      nome: "Full Body A",
      objetivo: "hipertrofia",
      professor: "Rafael Souza",
      itens: [{ exercicioId: "ex-1", series: 4, reps: "10", carga_kg: 40 }],
    },
  ],
};

afterEach(() => vi.clearAllMocks());

describe("useTreinos", () => {
  test("começa carregando e entrega os dados quando resolve", async () => {
    vi.mocked(getTreinosData).mockResolvedValue(payload);

    const { result } = renderHook(() => useTreinos());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
  });

  test("expõe mensagem de erro quando a busca falha", async () => {
    vi.mocked(getTreinosData).mockRejectedValue(new Error("json-server offline"));

    const { result } = renderHook(() => useTreinos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toMatch(/json-server offline/i);
  });
});
