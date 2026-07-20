import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { PeakHeatmap } from "../components/PeakHeatmap";
import type { Heatmap } from "../types";

function makeHeatmap(): Heatmap {
  const grid = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));
  grid[1][10] = 5; // segunda, 10h → pico
  grid[3][19] = 2;
  return { grid, max: 5 };
}

describe("PeakHeatmap", () => {
  test("renderiza os rótulos dos dias da semana", () => {
    render(<PeakHeatmap heatmap={makeHeatmap()} />);
    expect(screen.getByText("Seg")).toBeInTheDocument();
    expect(screen.getByText("Sáb")).toBeInTheDocument();
  });

  test("marca a célula de pico com título descritivo", () => {
    render(<PeakHeatmap heatmap={makeHeatmap()} />);
    expect(screen.getByTitle(/Seg 10h · 5 entradas/)).toBeInTheDocument();
  });

  test("mostra estado vazio quando não há entradas", () => {
    const grid = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));
    render(<PeakHeatmap heatmap={{ grid, max: 0 }} />);
    expect(screen.getByText(/Sem entradas registradas/i)).toBeInTheDocument();
  });
});
