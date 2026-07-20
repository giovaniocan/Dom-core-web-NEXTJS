import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { ProfissionalCard } from "../components/ProfissionalCard";
import type { Profissional } from "../types";

const prof: Profissional = {
  id: "pr-1",
  nome: "Rafael Souza",
  papel: "Personal",
  cref: "CREF 012345-G/PR",
  unidadeId: "un-1",
  alunos_ativos: 34,
  foto: "",
};

describe("ProfissionalCard", () => {
  test("exibe nome, papel, cref e a contagem de alunos ativos", () => {
    render(<ProfissionalCard profissional={prof} />);
    expect(screen.getByText("Rafael Souza")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("CREF 012345-G/PR")).toBeInTheDocument();
    expect(screen.getByText("34")).toBeInTheDocument();
  });

  test("dispara onClick com o profissional ao clicar no card", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ProfissionalCard profissional={prof} onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: /rafael souza/i }));

    expect(onClick).toHaveBeenCalledWith(prof);
  });
});
