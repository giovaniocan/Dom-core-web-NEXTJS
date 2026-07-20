import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { StatusPill } from "../StatusPill";

describe("StatusPill", () => {
  test("renderiza o rótulo do status conhecido", () => {
    render(<StatusPill status="ativo" />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  test("mapeia inadimplente para tom de perigo", () => {
    render(<StatusPill status="inadimplente" />);
    expect(screen.getByText("Inadimplente").className).toContain("text-danger");
  });

  test("mapeia paga para tom de sucesso", () => {
    render(<StatusPill status="paga" />);
    expect(screen.getByText("Paga").className).toContain("text-success");
  });

  test("usa o rótulo custom quando fornecido", () => {
    render(<StatusPill status="ativo" label="Em dia" />);
    expect(screen.getByText("Em dia")).toBeInTheDocument();
  });

  test("faz fallback para status desconhecido exibindo o próprio valor", () => {
    render(<StatusPill status="qualquer_coisa" />);
    expect(screen.getByText("qualquer_coisa")).toBeInTheDocument();
  });
});
