import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { FichaCard } from "../components/FichaCard";
import type { Exercicio, Ficha } from "../types";

const exercicios: Exercicio[] = [
  { id: "ex-1", nome: "Supino reto", grupo: "Peito", equipamento: "Barra" },
  { id: "ex-2", nome: "Agachamento livre", grupo: "Pernas", equipamento: "Barra" },
];

const ficha: Ficha = {
  id: "fi-1",
  alunoId: "al-1",
  nome: "Full Body A",
  objetivo: "hipertrofia",
  professor: "Rafael Souza",
  itens: [
    { exercicioId: "ex-1", series: 4, reps: "10", carga_kg: 40 },
    { exercicioId: "ex-2", series: 4, reps: "12", carga_kg: 60 },
  ],
};

describe("FichaCard", () => {
  test("exibe nome, objetivo e professor da ficha", () => {
    render(<FichaCard ficha={ficha} exercicios={exercicios} />);
    expect(screen.getByText("Full Body A")).toBeInTheDocument();
    expect(screen.getByText("hipertrofia")).toBeInTheDocument();
    expect(screen.getByText("Rafael Souza")).toBeInTheDocument();
  });

  test("resolve o exercicioId para o nome do exercício", () => {
    render(<FichaCard ficha={ficha} exercicios={exercicios} />);
    expect(screen.getByText("Supino reto")).toBeInTheDocument();
    expect(screen.getByText("Agachamento livre")).toBeInTheDocument();
    // não deve vazar o id cru quando o exercício existe
    expect(screen.queryByText("ex-1")).not.toBeInTheDocument();
  });

  test("mostra séries × reps @ carga de cada item", () => {
    render(<FichaCard ficha={ficha} exercicios={exercicios} />);
    expect(screen.getByText(/4 × 10 @ 40 kg/)).toBeInTheDocument();
    expect(screen.getByText(/4 × 12 @ 60 kg/)).toBeInTheDocument();
  });
});
