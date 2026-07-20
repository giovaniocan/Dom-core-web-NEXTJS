import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { Button } from "../Button";

describe("Button", () => {
  test("renderiza o texto filho", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  test("dispara onClick quando clicado", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clicar</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Clicar" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("não dispara onClick quando desabilitado", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Off
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Off" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test("aplica a variante primária por padrão", () => {
    render(<Button>Primário</Button>);
    expect(screen.getByRole("button").className).toContain("bg-primary-btn");
  });

  test("aplica classes da variante ghost", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").className).toContain("bg-transparent");
  });
});
