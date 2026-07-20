import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { OccupancyBoard } from "../components/OccupancyBoard";
import type { OcupacaoUnidade } from "../types";

const ocupacao: OcupacaoUnidade[] = [
  { unidadeId: "un-1", nome: "Unidade Centro", dentro: 42, capacidade: 260, pct: 16 },
  { unidadeId: "un-2", nome: "Unidade Batel", dentro: 0, capacidade: 180, pct: 0 },
];

describe("OccupancyBoard", () => {
  test("mostra o nome e a lotação de cada unidade", () => {
    render(<OccupancyBoard ocupacao={ocupacao} />);
    expect(screen.getByText("Unidade Centro")).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByText(/260/)).toBeInTheDocument();
  });

  test("renderiza uma barra de progresso por unidade", () => {
    render(<OccupancyBoard ocupacao={ocupacao} />);
    expect(screen.getAllByRole("progressbar")).toHaveLength(2);
  });
});
