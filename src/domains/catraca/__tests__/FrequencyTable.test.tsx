import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { FrequencyTable } from "../components/FrequencyTable";
import type { FrequenciaAluno } from "../types";

const frequencias: FrequenciaAluno[] = [
  {
    alunoId: "al-1",
    nome: "Ana Rocha",
    foto: "",
    status: "ativo",
    entradas: 14,
    ultimaEntrada: "2026-07-20T10:00:00.000Z",
  },
  {
    alunoId: "al-4",
    nome: "Duda Lima",
    foto: "",
    status: "inadimplente",
    entradas: 3,
    ultimaEntrada: "2026-07-15T08:00:00.000Z",
  },
];

describe("FrequencyTable", () => {
  test("lista alunos com o número de entradas", () => {
    render(<FrequencyTable frequencias={frequencias} />);
    expect(screen.getByText("Ana Rocha")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  test("mostra estado vazio quando não há frequência", () => {
    render(<FrequencyTable frequencias={[]} />);
    expect(screen.getByText(/Nenhuma entrada/i)).toBeInTheDocument();
  });
});
