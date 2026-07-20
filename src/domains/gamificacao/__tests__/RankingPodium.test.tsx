import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { RankingPodium } from "../components/RankingPodium";
import type { RankingEntry } from "../types";

const top3: RankingEntry[] = [
  { id: "rk-1", posicao: 1, alunoId: "al-12", nome: "Leonardo Antunes", xp: 4122, streak: 5 },
  { id: "rk-2", posicao: 2, alunoId: "al-24", nome: "Yasmin Oliveira", xp: 3824, streak: 20 },
  { id: "rk-3", posicao: 3, alunoId: "al-13", nome: "Mariana Sales", xp: 3132, streak: 14 },
];

describe("RankingPodium", () => {
  test("exibe os nomes dos três primeiros colocados", () => {
    render(<RankingPodium top3={top3} />);
    expect(screen.getByText("Leonardo Antunes")).toBeInTheDocument();
    expect(screen.getByText("Yasmin Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Mariana Sales")).toBeInTheDocument();
  });

  test("exibe o XP do líder formatado", () => {
    render(<RankingPodium top3={top3} />);
    expect(screen.getByText(/4\.122/)).toBeInTheDocument();
  });

  test("não quebra quando o pódio está vazio", () => {
    const { container } = render(<RankingPodium top3={[]} />);
    expect(container).toBeTruthy();
  });
});
