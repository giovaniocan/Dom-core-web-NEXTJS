import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { RefeicaoCard } from "../components/RefeicaoCard";
import type { Refeicao } from "../types";

const base: Refeicao = {
  nome: "Café da manhã",
  horario: "07:00",
  itens: ["Ovos mexidos (3 un)", "Pão integral (2 fatias)", "Mamão (1 fatia)"],
  kcal: 420,
  proteina: 26,
  carbo: 42,
  gordura: 15,
  feito: true,
};

describe("RefeicaoCard", () => {
  test("exibe o nome, o horário e os itens da refeição", () => {
    render(<RefeicaoCard refeicao={base} />);
    expect(screen.getByText("Café da manhã")).toBeInTheDocument();
    expect(screen.getByText("07:00")).toBeInTheDocument();
    expect(screen.getByText("Ovos mexidos (3 un)")).toBeInTheDocument();
    expect(screen.getByText("Pão integral (2 fatias)")).toBeInTheDocument();
  });

  test("mostra o status 'Feito' quando a refeição foi feita", () => {
    render(<RefeicaoCard refeicao={{ ...base, feito: true }} />);
    expect(screen.getByText("Feito")).toBeInTheDocument();
  });

  test("mostra o status 'Pendente' quando a refeição não foi feita", () => {
    render(<RefeicaoCard refeicao={{ ...base, feito: false }} />);
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });
});
