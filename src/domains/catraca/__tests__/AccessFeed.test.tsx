import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { AccessFeed } from "../components/AccessFeed";
import type { Acesso } from "../types";

const passes: Acesso[] = [
  {
    id: "a1",
    alunoId: "al-1",
    aluno: "Ana Rocha",
    foto: "",
    unidadeId: "un-1",
    terminal: "Catraca Centro 01",
    sentido: "entrada",
    resultado: "liberado",
    motivo: null,
    timestamp: "2026-07-20T12:00:00.000Z",
  },
  {
    id: "a2",
    alunoId: "al-4",
    aluno: "Duda Lima",
    foto: "",
    unidadeId: "un-1",
    terminal: "Catraca Centro 02",
    sentido: "entrada",
    resultado: "negado",
    motivo: "Fatura vencida",
    timestamp: "2026-07-20T11:50:00.000Z",
  },
];

describe("AccessFeed", () => {
  test("lista os nomes das passagens", () => {
    render(<AccessFeed passes={passes} />);
    expect(screen.getByText("Ana Rocha")).toBeInTheDocument();
    expect(screen.getByText("Duda Lima")).toBeInTheDocument();
  });

  test("exibe o motivo em passagens negadas", () => {
    render(<AccessFeed passes={passes} />);
    expect(screen.getByText(/Fatura vencida/)).toBeInTheDocument();
  });

  test("mostra estado vazio quando não há passagens", () => {
    render(<AccessFeed passes={[]} />);
    expect(screen.getByText(/Nenhuma passagem/i)).toBeInTheDocument();
  });
});
