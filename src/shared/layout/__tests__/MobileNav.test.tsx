import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { MobileNav } from "../MobileNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("MobileNav", () => {
  test("mostra o botão de abrir menu (hamburguer)", () => {
    render(<MobileNav />);
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });

  test("drawer começa fechado — links de navegação não estão no DOM", () => {
    render(<MobileNav />);
    expect(screen.queryByRole("link", { name: /financeiro/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Fechar menu" })).not.toBeInTheDocument();
  });

  test("abre o drawer e revela os links de navegação", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));

    expect(screen.getByRole("dialog", { name: "Menu de navegação" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /financeiro/i })).toBeInTheDocument();
  });

  test("fecha o drawer pelo botão fechar", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(screen.getByRole("button", { name: "Fechar menu" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /financeiro/i })).not.toBeInTheDocument();
  });
});
