import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFinanceiro } from "../hooks/useFinanceiro";
import { getFinanceiroData } from "../services/financeiro-service";
import type { FinanceiroData } from "../types";

vi.mock("../services/financeiro-service", () => ({
  getFinanceiroData: vi.fn(),
}));

const payload: FinanceiroData = {
  faturas: [
    {
      id: "ft-1",
      alunoId: "al-1",
      aluno: "Ana",
      contratoId: "ct-1",
      competencia: "2026-07",
      vencimento: "2026-07-10",
      valor: 100,
      status: "vencida",
      meio: "pix",
      pago_em: null,
      tentativas_cobranca: 2,
      ultima_tentativa: null,
    },
  ],
  planos: [{ id: "pl-1", nome: "Mensal", valor: 129.9, periodo_meses: 1, descricao: "" }],
};

afterEach(() => vi.clearAllMocks());

describe("useFinanceiro", () => {
  test("começa carregando e entrega os dados quando resolve", async () => {
    vi.mocked(getFinanceiroData).mockResolvedValue(payload);

    const { result } = renderHook(() => useFinanceiro());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
  });

  test("expõe mensagem de erro quando a busca falha", async () => {
    vi.mocked(getFinanceiroData).mockRejectedValue(new Error("json-server offline"));

    const { result } = renderHook(() => useFinanceiro());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toMatch(/json-server offline/i);
  });
});
