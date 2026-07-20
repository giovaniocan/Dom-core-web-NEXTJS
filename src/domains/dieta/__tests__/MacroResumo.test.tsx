import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { MacroResumo } from "../components/MacroResumo";
import type { MacroTotais } from "../types";

const metas: MacroTotais = { kcal: 1800, proteina: 120, carbo: 180, gordura: 55 };
const soma: MacroTotais = { kcal: 1360, proteina: 92, carbo: 152, gordura: 40 };

describe("MacroResumo", () => {
  test("lista os quatro macros com rótulos", () => {
    render(<MacroResumo metas={metas} soma={soma} />);
    expect(screen.getByText("Calorias")).toBeInTheDocument();
    expect(screen.getByText("Proteína")).toBeInTheDocument();
    expect(screen.getByText("Carboidrato")).toBeInTheDocument();
    expect(screen.getByText("Gordura")).toBeInTheDocument();
  });

  test("mostra a soma frente à meta de cada macro", () => {
    render(<MacroResumo metas={metas} soma={soma} />);
    expect(screen.getByText(/1360 \/ 1800 kcal/)).toBeInTheDocument();
    expect(screen.getByText(/92 \/ 120 g/)).toBeInTheDocument();
  });
});
