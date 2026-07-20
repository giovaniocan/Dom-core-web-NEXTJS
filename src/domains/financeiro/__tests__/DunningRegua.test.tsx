import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { DunningRegua } from "../components/DunningRegua";
import { buildDunningRegua } from "../services/financeiro-service";
import type { Fatura } from "../types";

const REF = new Date(2026, 6, 20);

function fatura(overrides: Partial<Fatura>): Fatura {
  return {
    id: "ft",
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
    ultima_tentativa: null,
    ...overrides,
  };
}

describe("DunningRegua", () => {
  const regua = buildDunningRegua(
    [
      fatura({ id: "v1", vencimento: "2026-07-19" }),
      fatura({ id: "v2", vencimento: "2026-07-16" }),
      fatura({ id: "v3", vencimento: "2026-07-13" }),
    ],
    REF,
  );

  test("renderiza as 4 etapas da régua", () => {
    render(<DunningRegua regua={regua} />);
    expect(screen.getByText("D+1")).toBeInTheDocument();
    expect(screen.getByText("D+3")).toBeInTheDocument();
    expect(screen.getByText("D+5")).toBeInTheDocument();
    expect(screen.getByText("D+7")).toBeInTheDocument();
  });

  test("mostra a ação de cada etapa", () => {
    render(<DunningRegua regua={regua} />);
    expect(screen.getByText(/WhatsApp automático/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloqueio de acesso/i)).toBeInTheDocument();
  });

  test("exibe a taxa média de recuperação", () => {
    render(<DunningRegua regua={regua} />);
    expect(screen.getByText(`${regua.taxaRecuperacaoMedia}%`)).toBeInTheDocument();
  });
});
