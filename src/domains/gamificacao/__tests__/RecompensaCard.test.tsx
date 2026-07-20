import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { RecompensaCard } from "../components/RecompensaCard";
import type { Recompensa } from "../types";

const recompensa: Recompensa = {
  id: "rw-1",
  nome: "Camiseta DomCore",
  custo_xp: 2500,
  estoque: 30,
  categoria: "produto",
};

describe("RecompensaCard", () => {
  test("exibe o nome e o custo em XP da recompensa", () => {
    render(<RecompensaCard recompensa={recompensa} />);
    expect(screen.getByText("Camiseta DomCore")).toBeInTheDocument();
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  test("exibe o estoque e a categoria", () => {
    render(<RecompensaCard recompensa={recompensa} />);
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/produto/i)).toBeInTheDocument();
  });
});
