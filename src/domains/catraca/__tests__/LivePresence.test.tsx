import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { LivePresence } from "../components/LivePresence";
import type { PresencaAluno } from "../types";

const presentes: PresencaAluno[] = [
  {
    alunoId: "al-2",
    aluno: "Bruno Alves",
    foto: "",
    unidadeId: "un-1",
    terminal: "Catraca Centro 01",
    desde: "2026-07-20T12:00:00.000Z",
  },
  {
    alunoId: "al-3",
    aluno: "Caetano Dias",
    foto: "",
    unidadeId: "un-2",
    terminal: "Catraca Batel 01",
    desde: "2026-07-20T09:00:00.000Z",
  },
];

describe("LivePresence", () => {
  test("lista quem está na academia agora", () => {
    render(<LivePresence presentes={presentes} />);
    expect(screen.getByText("Bruno Alves")).toBeInTheDocument();
    expect(screen.getByText("Caetano Dias")).toBeInTheDocument();
  });

  test("mostra a contagem de presentes", () => {
    render(<LivePresence presentes={presentes} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("mostra estado vazio quando a academia está vazia", () => {
    render(<LivePresence presentes={[]} />);
    expect(screen.getByText(/Academia vazia/i)).toBeInTheDocument();
  });
});
