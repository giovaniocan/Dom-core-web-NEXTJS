import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { KpiRow } from "../components/KpiRow";
import type { DashboardKpis } from "../types";

const kpis: DashboardKpis = {
  alunosAtivos: 182,
  alunosAtivosDelta: "+6%",
  checkinsHoje: 74,
  inadimplentes: 9,
  aReceber: 4230,
  novosNoMes: 12,
  novosNoMesDelta: "+3",
  ocupacaoPct: 68,
};

describe("KpiRow", () => {
  test("exibe o número de alunos ativos", () => {
    render(<KpiRow kpis={kpis} />);
    expect(screen.getByText("182")).toBeInTheDocument();
    expect(screen.getByText("Alunos ativos")).toBeInTheDocument();
  });

  test("exibe check-ins de hoje", () => {
    render(<KpiRow kpis={kpis} />);
    expect(screen.getByText("74")).toBeInTheDocument();
  });

  test("exibe inadimplentes e o valor a receber formatado em BRL", () => {
    render(<KpiRow kpis={kpis} />);
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?4\.230,00/)).toBeInTheDocument();
  });

  test("exibe a ocupação como percentual", () => {
    render(<KpiRow kpis={kpis} />);
    expect(screen.getByText("68%")).toBeInTheDocument();
  });
});
