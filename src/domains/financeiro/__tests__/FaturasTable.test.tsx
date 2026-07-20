import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { FaturasTable } from "../components/FaturasTable";
import type { Fatura } from "../types";

const faturas: Fatura[] = [
  {
    id: "ft-1",
    alunoId: "al-4",
    aluno: "Daniel Prado",
    contratoId: "ct-4",
    competencia: "2026-06",
    vencimento: "2026-06-20",
    valor: 349.9,
    status: "vencida",
    meio: "pix",
    pago_em: null,
    tentativas_cobranca: 4,
    ultima_tentativa: "2026-07-17",
  },
  {
    id: "ft-2",
    alunoId: "al-1",
    aluno: "Ana Rocha",
    contratoId: "ct-1",
    competencia: "2026-07",
    vencimento: "2026-07-24",
    valor: 99.9,
    status: "aberta",
    meio: "cartao",
    pago_em: null,
    tentativas_cobranca: 0,
    ultima_tentativa: null,
  },
];

describe("FaturasTable", () => {
  test("exibe o aluno e o valor formatado em BRL", () => {
    render(<FaturasTable faturas={faturas} />);
    expect(screen.getByText("Daniel Prado")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?349,90/)).toBeInTheDocument();
  });

  test("exibe o status da fatura via StatusPill", () => {
    render(<FaturasTable faturas={faturas} />);
    expect(screen.getByText("Vencida")).toBeInTheDocument();
    expect(screen.getByText("Aberta")).toBeInTheDocument();
  });

  test("mostra estado vazio quando não há faturas", () => {
    render(<FaturasTable faturas={[]} />);
    expect(screen.getByText(/nenhuma fatura/i)).toBeInTheDocument();
  });

  test("dispara onCobrar ao clicar em Cobrar", async () => {
    const onCobrar = vi.fn();
    const user = userEvent.setup();
    render(<FaturasTable faturas={faturas} onCobrar={onCobrar} />);

    const botoes = screen.getAllByRole("button", { name: /cobrar/i });
    await user.click(botoes[0]);

    expect(onCobrar).toHaveBeenCalledWith(faturas[0]);
  });
});
