import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { GamificacaoTab } from "../components/GamificacaoTab";
import type { Aluno, RankingEntry } from "../types";

function makeAluno(over: Partial<Aluno> = {}): Aluno {
  return {
    id: "al-12",
    academiaId: "ac-1",
    unidadeId: "un-1",
    nome: "Leonardo Antunes",
    genero: "M",
    email: "leo@email.com",
    telefone: "(41) 90000-0000",
    foto: "",
    status: "ativo",
    planoId: "pl-1",
    plano: "Mensal",
    matricula: "2025-01-10",
    vencimento: "2026-08-10",
    ultima_visita: "2026-07-19",
    xp: 3200,
    streak: 16,
    nascimento: "1998-05-05",
    ...over,
  };
}

const ranking: RankingEntry[] = [
  { id: "rk-1", posicao: 1, alunoId: "al-12", nome: "Leonardo Antunes", xp: 3200, streak: 16 },
];

describe("GamificacaoTab", () => {
  test("exibe XP e streak do aluno", () => {
    render(<GamificacaoTab aluno={makeAluno()} ranking={ranking} />);

    expect(screen.getByText("3.200")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });

  test("mostra a posição no ranking quando pontuado", () => {
    render(<GamificacaoTab aluno={makeAluno()} ranking={ranking} />);
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  test("mostra as conquistas desbloqueadas", () => {
    render(<GamificacaoTab aluno={makeAluno({ xp: 3200, streak: 16, status: "ativo" })} ranking={ranking} />);
    expect(screen.getByText(/elite xp/i)).toBeInTheDocument();
  });
});
