import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { BarChart } from "../components/BarChart";
import type { ChartDatum } from "../types";

const data: ChartDatum[] = [
  { label: "jun/26", value: 100 },
  { label: "jul/26", value: 250 },
  { label: "ago/26", value: 175 },
];

describe("BarChart", () => {
  test("renderiza uma barra por ponto de dados", () => {
    render(<BarChart data={data} />);
    expect(screen.getAllByTestId("bar")).toHaveLength(3);
  });

  test("exibe os rótulos de categoria", () => {
    render(<BarChart data={data} />);
    expect(screen.getByText("jun/26")).toBeInTheDocument();
    expect(screen.getByText("ago/26")).toBeInTheDocument();
  });

  test("formata os valores quando `formatValue` é fornecido", () => {
    render(<BarChart data={data} formatValue={(v) => `R$ ${v}`} />);
    expect(screen.getByText("R$ 250")).toBeInTheDocument();
  });

  test("mostra estado vazio e nenhuma barra sem dados", () => {
    render(<BarChart data={[]} />);
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument();
    expect(screen.queryAllByTestId("bar")).toHaveLength(0);
  });
});
