import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { MissingStudents } from "../components/MissingStudents";
import type { AlunoSumido } from "../types";

const sumidos: AlunoSumido[] = [
  { id: "al-4", nome: "Duda Lima", foto: "", status: "inadimplente", ultima_visita: "2026-07-01", diasAusente: 19 },
  { id: "al-2", nome: "Bruno Alves", foto: "", status: "ativo", ultima_visita: "2026-07-10", diasAusente: 10 },
];

describe("MissingStudents", () => {
  test("lista os alunos sumidos com dias de ausência", () => {
    render(<MissingStudents sumidos={sumidos} />);
    expect(screen.getByText("Duda Lima")).toBeInTheDocument();
    expect(screen.getByText(/19 dias/)).toBeInTheDocument();
  });

  test("mostra estado vazio quando ninguém sumiu", () => {
    render(<MissingStudents sumidos={[]} />);
    expect(screen.getByText(/Ninguém sumido/i)).toBeInTheDocument();
  });
});
