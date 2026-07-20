import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useInadimplencia } from "../hooks/useInadimplencia";
import { getInadimplenciaData } from "../services/financeiro-service";
import type { InadimplenciaData } from "../types";

vi.mock("../services/financeiro-service", () => ({
  getInadimplenciaData: vi.fn(),
}));

const payload: InadimplenciaData = {
  faturasVencidas: [
    {
      id: "ft-1",
      alunoId: "al-1",
      aluno: "Ana",
      contratoId: "ct-1",
      competencia: "2026-07",
      vencimento: "2026-07-01",
      valor: 200,
      status: "vencida",
      meio: "pix",
      pago_em: null,
      tentativas_cobranca: 4,
      ultima_tentativa: null,
    },
  ],
  alunos: [
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
  ],
};

afterEach(() => vi.clearAllMocks());

describe("useInadimplencia", () => {
  test("carrega e entrega faturas vencidas + alunos", async () => {
    vi.mocked(getInadimplenciaData).mockResolvedValue(payload);

    const { result } = renderHook(() => useInadimplencia());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
  });

  test("propaga erro amigável quando falha", async () => {
    vi.mocked(getInadimplenciaData).mockRejectedValue(new Error("falhou"));

    const { result } = renderHook(() => useInadimplencia());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toMatch(/falhou/i);
  });
});
