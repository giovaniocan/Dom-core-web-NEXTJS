import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { TerminalStatus } from "../components/TerminalStatus";
import type { TerminalInfo } from "../types";

const terminais: TerminalInfo[] = [
  {
    terminal: "Catraca Centro 01",
    unidadeId: "un-1",
    ultimaAtividade: "2026-07-20T12:00:00.000Z",
    totalPassagens: 12,
    online: true,
  },
  {
    terminal: "Catraca Batel 01",
    unidadeId: "un-2",
    ultimaAtividade: "2026-07-20T09:00:00.000Z",
    totalPassagens: 3,
    online: false,
  },
];

describe("TerminalStatus", () => {
  test("lista os terminais com nome e total de passagens", () => {
    render(<TerminalStatus terminais={terminais} />);
    expect(screen.getByText("Catraca Centro 01")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  test("indica terminais online e offline", () => {
    render(<TerminalStatus terminais={terminais} />);
    expect(screen.getByText(/Online/i)).toBeInTheDocument();
    expect(screen.getByText(/Offline/i)).toBeInTheDocument();
  });

  test("mostra estado vazio sem terminais", () => {
    render(<TerminalStatus terminais={[]} />);
    expect(screen.getByText(/Nenhum terminal/i)).toBeInTheDocument();
  });
});
