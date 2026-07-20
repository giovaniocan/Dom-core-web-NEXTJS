import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { InadimplentesTable } from "../components/InadimplentesTable";
import { buildInadimplentes } from "../services/financeiro-service";
import type { AlunoResumo, Fatura } from "../types";

const REF = new Date(2026, 6, 20);

const alunos: AlunoResumo[] = [
  {
    id: "al-1",
    nome: "Daniel Prado",
    email: "daniel@x.com",
    telefone: "(41) 1",
    foto: "",
    status: "inadimplente",
    plano: "Anual",
    planoId: "pl-3",
  },
];

const faturas: Fatura[] = [
  {
    id: "ft-1",
    alunoId: "al-1",
    aluno: "Daniel Prado",
    contratoId: "ct-1",
    competencia: "2026-06",
    vencimento: "2026-06-20",
    valor: 349.9,
    status: "vencida",
    meio: "pix",
    pago_em: null,
    tentativas_cobranca: 4,
    ultima_tentativa: "2026-07-17",
  },
];

describe("InadimplentesTable", () => {
  const rows = buildInadimplentes(faturas, alunos, REF);

  test("mostra quem deve, quanto e há quantos dias", () => {
    render(<InadimplentesTable rows={rows} />);
    expect(screen.getByText("Daniel Prado")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?349,90/)).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  test("estado vazio quando ninguém está inadimplente", () => {
    render(<InadimplentesTable rows={[]} />);
    expect(screen.getByText(/nenhum inadimplente/i)).toBeInTheDocument();
  });

  test("dispara onCobrar com a fatura ao clicar em Cobrar", async () => {
    const onCobrar = vi.fn();
    const user = userEvent.setup();
    render(<InadimplentesTable rows={rows} onCobrar={onCobrar} />);

    await user.click(screen.getByRole("button", { name: /cobrar/i }));

    expect(onCobrar).toHaveBeenCalledWith(rows[0]);
  });
});
