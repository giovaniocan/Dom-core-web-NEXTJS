import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { AlunosTable } from "../components/AlunosTable";
import type { Aluno } from "../types";

function makeAluno(over: Partial<Aluno> = {}): Aluno {
  return {
    id: "al-1",
    academiaId: "ac-1",
    unidadeId: "un-1",
    nome: "Ana Beatriz Rocha",
    genero: "F",
    email: "ana@email.com",
    telefone: "(41) 99677-4965",
    foto: "",
    status: "ativo",
    planoId: "pl-4",
    plano: "Student",
    matricula: "2025-08-18",
    vencimento: "2026-07-24",
    ultima_visita: "2026-07-16",
    xp: 1760,
    streak: 16,
    nascimento: "2001-03-22",
    ...over,
  };
}

describe("AlunosTable", () => {
  test("renderiza uma linha por aluno com nome e plano", () => {
    const alunos = [
      makeAluno({ id: "al-1", nome: "Ana Beatriz Rocha", plano: "Student" }),
      makeAluno({ id: "al-2", nome: "Bruno Costa", plano: "Mensal" }),
    ];
    render(<AlunosTable alunos={alunos} onSelect={vi.fn()} />);

    expect(screen.getByText("Ana Beatriz Rocha")).toBeInTheDocument();
    expect(screen.getByText("Bruno Costa")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
  });

  test("dispara onSelect com o aluno clicado", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const aluno = makeAluno({ id: "al-9", nome: "Carla Dias" });
    render(<AlunosTable alunos={[aluno]} onSelect={onSelect} />);

    await user.click(screen.getByText("Carla Dias"));

    expect(onSelect).toHaveBeenCalledWith(aluno);
  });

  test("mostra o status via StatusPill", () => {
    render(<AlunosTable alunos={[makeAluno({ status: "inadimplente" })]} onSelect={vi.fn()} />);
    expect(screen.getByText("Inadimplente")).toBeInTheDocument();
  });
});
