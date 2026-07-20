import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { FinanceiroTab } from "../components/FinanceiroTab";
import type { Fatura } from "../types";

function makeFatura(over: Partial<Fatura> = {}): Fatura {
  return {
    id: "ft-1",
    alunoId: "al-1",
    aluno: "Ana Beatriz Rocha",
    contratoId: "ct-1",
    competencia: "2026-06",
    vencimento: "2026-06-20",
    valor: 100,
    status: "paga",
    meio: "pix",
    pago_em: "2026-06-19",
    tentativas_cobranca: 0,
    ultima_tentativa: null,
    ...over,
  };
}

describe("FinanceiroTab", () => {
  test("mostra o total vencido no resumo", () => {
    render(
      <FinanceiroTab
        faturas={[
          makeFatura({ id: "ft-1", status: "paga", valor: 100 }),
          makeFatura({ id: "ft-2", status: "vencida", valor: 349.9 }),
          makeFatura({ id: "ft-3", status: "vencida", valor: 0.1 }),
        ]}
      />,
    );

    // 349,90 + 0,10 = 350,00 (valor único, não colide com linhas da tabela)
    expect(screen.getByText("R$ 350,00")).toBeInTheDocument();
    expect(screen.getByText(/vencido/i)).toBeInTheDocument();
  });

  test("lista as faturas do aluno", () => {
    render(
      <FinanceiroTab
        faturas={[makeFatura({ id: "ft-1", competencia: "2026-05", status: "aberta" })]}
      />,
    );

    expect(screen.getByText("2026-05")).toBeInTheDocument();
    expect(screen.getByText("Aberta")).toBeInTheDocument();
  });

  test("estado vazio quando o aluno não tem faturas", () => {
    render(<FinanceiroTab faturas={[]} />);
    expect(screen.getByText(/nenhuma fatura/i)).toBeInTheDocument();
  });
});
