import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { WeeklyGrid } from "../components/WeeklyGrid";
import type { Aula } from "../types";

const aulas: Aula[] = [
  { id: "au-1", nome: "Spinning", professor: "Rafael", unidadeId: "un-1", dia: "Seg", hora: "07:00", vagas: 20, inscritos: 18 },
  { id: "au-3", nome: "Yoga", professor: "Camila", unidadeId: "un-2", dia: "Ter", hora: "08:00", vagas: 15, inscritos: 12 },
];

describe("WeeklyGrid", () => {
  test("renderiza os horários como linhas", () => {
    render(<WeeklyGrid aulas={aulas} onSelect={() => {}} />);
    expect(screen.getByText("07:00")).toBeInTheDocument();
    expect(screen.getByText("08:00")).toBeInTheDocument();
  });

  test("renderiza os cabeçalhos de dias", () => {
    render(<WeeklyGrid aulas={aulas} onSelect={() => {}} />);
    expect(screen.getByText("Seg")).toBeInTheDocument();
    expect(screen.getByText("Ter")).toBeInTheDocument();
  });

  test("renderiza uma aula na grade e a seleciona ao clicar", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<WeeklyGrid aulas={aulas} onSelect={onSelect} />);

    await user.click(screen.getByText("Spinning"));
    expect(onSelect).toHaveBeenCalledWith(aulas[0]);
  });

  test("mostra estado vazio quando não há aulas", () => {
    render(<WeeklyGrid aulas={[]} onSelect={() => {}} />);
    expect(screen.getByText(/nenhuma aula/i)).toBeInTheDocument();
  });
});
