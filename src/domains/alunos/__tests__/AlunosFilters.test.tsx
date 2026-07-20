import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { AlunosFilters } from "../components/AlunosFilters";
import type { AlunosFilter } from "../types";

const base: AlunosFilter = { search: "", status: "todos", plano: "todos" };

describe("AlunosFilters", () => {
  test("emite a busca digitada mantendo os demais filtros", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AlunosFilters filter={base} planos={["Mensal"]} onChange={onChange} />);

    await user.type(screen.getByPlaceholderText(/buscar/i), "a");

    expect(onChange).toHaveBeenLastCalledWith({ search: "a", status: "todos", plano: "todos" });
  });

  test("emite o status selecionado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AlunosFilters filter={base} planos={["Mensal"]} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText(/status/i), "inadimplente");

    expect(onChange).toHaveBeenCalledWith({ search: "", status: "inadimplente", plano: "todos" });
  });

  test("renderiza um option por plano recebido", () => {
    const onChange = vi.fn();
    render(
      <AlunosFilters filter={base} planos={["Mensal", "Anual Black"]} onChange={onChange} />,
    );

    expect(screen.getByRole("option", { name: "Mensal" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Anual Black" })).toBeInTheDocument();
  });
});
