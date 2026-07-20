import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { ClassCard } from "../components/ClassCard";
import type { Aula } from "../types";

const aula: Aula = {
  id: "au-1",
  nome: "Spinning",
  professor: "Rafael Souza",
  unidadeId: "un-1",
  dia: "Seg",
  hora: "07:00",
  vagas: 20,
  inscritos: 18,
};

describe("ClassCard", () => {
  test("mostra modalidade, professor e ocupação", () => {
    render(<ClassCard aula={aula} onClick={() => {}} />);
    expect(screen.getByText("Spinning")).toBeInTheDocument();
    expect(screen.getByText(/Rafael Souza/)).toBeInTheDocument();
    expect(screen.getByText("18/20")).toBeInTheDocument();
  });

  test("marca turma lotada", () => {
    render(<ClassCard aula={{ ...aula, inscritos: 20 }} onClick={() => {}} />);
    expect(screen.getByText(/lotada/i)).toBeInTheDocument();
  });

  test("dispara onClick ao ser acionado", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ClassCard aula={aula} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
