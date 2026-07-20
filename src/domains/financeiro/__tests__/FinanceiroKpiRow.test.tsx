import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { FinanceiroKpiRow } from "../components/FinanceiroKpiRow";
import type { FinanceiroKpis } from "../types";

const kpis: FinanceiroKpis = {
  recebidoMes: 12000,
  aReceber: 3400,
  emAtraso: 1800,
  qtdPagas: 17,
  qtdAbertas: 8,
  qtdVencidas: 4,
  taxaInadimplencia: 11,
};

describe("FinanceiroKpiRow", () => {
  test("exibe recebido, a receber e em atraso formatados em BRL", () => {
    render(<FinanceiroKpiRow kpis={kpis} />);
    expect(screen.getByText(/R\$\s?12\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?3\.400,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?1\.800,00/)).toBeInTheDocument();
  });

  test("exibe a taxa de inadimplência", () => {
    render(<FinanceiroKpiRow kpis={kpis} />);
    expect(screen.getByText("11%")).toBeInTheDocument();
  });
});
