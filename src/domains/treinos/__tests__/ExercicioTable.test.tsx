import { describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { ExercicioTable } from "../components/ExercicioTable";
import type { Exercicio } from "../types";

const exercicios: Exercicio[] = [
  { id: "ex-1", nome: "Supino reto", grupo: "Peito", equipamento: "Barra" },
  { id: "ex-2", nome: "Agachamento livre", grupo: "Pernas", equipamento: "Barra" },
  { id: "ex-6", nome: "Leg press 45", grupo: "Pernas", equipamento: "Máquina" },
];

describe("ExercicioTable", () => {
  test("renderiza uma linha por exercício", () => {
    render(<ExercicioTable exercicios={exercicios} />);
    expect(screen.getByText("Supino reto")).toBeInTheDocument();
    expect(screen.getByText("Agachamento livre")).toBeInTheDocument();
    expect(screen.getByText("Leg press 45")).toBeInTheDocument();
  });

  test("oferece um chip de filtro por grupo muscular distinto", () => {
    render(<ExercicioTable exercicios={exercicios} />);
    expect(screen.getByRole("button", { name: "Peito" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pernas" })).toBeInTheDocument();
  });

  test("filtra os exercícios ao clicar em um grupo", async () => {
    const user = userEvent.setup();
    render(<ExercicioTable exercicios={exercicios} />);

    await user.click(screen.getByRole("button", { name: "Pernas" }));

    expect(screen.getByText("Agachamento livre")).toBeInTheDocument();
    expect(screen.getByText("Leg press 45")).toBeInTheDocument();
    expect(screen.queryByText("Supino reto")).not.toBeInTheDocument();
  });

  test("volta a exibir todos ao clicar em Todos", async () => {
    const user = userEvent.setup();
    render(<ExercicioTable exercicios={exercicios} />);

    await user.click(screen.getByRole("button", { name: "Peito" }));
    expect(screen.queryByText("Agachamento livre")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Todos" }));
    expect(screen.getByText("Agachamento livre")).toBeInTheDocument();
    expect(screen.getByText("Supino reto")).toBeInTheDocument();
  });
});
