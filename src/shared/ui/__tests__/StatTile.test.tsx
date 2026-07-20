import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { StatTile } from "../StatTile";

describe("StatTile", () => {
  test("exibe rótulo e valor", () => {
    render(<StatTile label="Alunos ativos" value={182} />);
    expect(screen.getByText("Alunos ativos")).toBeInTheDocument();
    expect(screen.getByText("182")).toBeInTheDocument();
  });

  test("exibe a variação (delta) quando fornecida", () => {
    render(<StatTile label="Novos" value={12} delta={{ value: "+8%", trend: "up" }} />);
    expect(screen.getByText("+8%")).toBeInTheDocument();
  });

  test("aplica cor de sucesso para tendência positiva", () => {
    render(<StatTile label="Novos" value={12} delta={{ value: "+8%", trend: "up" }} />);
    expect(screen.getByText("+8%").className).toContain("text-success");
  });

  test("aplica cor de perigo para tendência negativa", () => {
    render(<StatTile label="Cancelados" value={3} delta={{ value: "-2%", trend: "down" }} />);
    expect(screen.getByText("-2%").className).toContain("text-danger");
  });

  test("renderiza hint auxiliar", () => {
    render(<StatTile label="A receber" value="R$ 4.200" hint="7 faturas em aberto" />);
    expect(screen.getByText("7 faturas em aberto")).toBeInTheDocument();
  });
});
