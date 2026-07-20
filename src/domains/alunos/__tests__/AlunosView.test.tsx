import { afterEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/test/utils";
import { AlunosView } from "../components/AlunosView";
import type { Aluno } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function makeAluno(over: Partial<Aluno> = {}): Aluno {
  return {
    id: "al-1",
    academiaId: "ac-1",
    unidadeId: "un-1",
    nome: "Ana Beatriz Rocha",
    genero: "F",
    email: "ana@email.com",
    telefone: "(41) 99677-4965",
    foto: "",
    status: "ativo",
    planoId: "pl-4",
    plano: "Student",
    matricula: "2025-08-18",
    vencimento: "2026-07-24",
    ultima_visita: "2026-07-16",
    xp: 1760,
    streak: 16,
    nascimento: "2001-03-22",
    ...over,
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("AlunosView", () => {
  test("carrega e lista os alunos", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue([
      makeAluno({ id: "al-1", nome: "Ana Beatriz Rocha" }),
      makeAluno({ id: "al-2", nome: "Bruno Costa", status: "inadimplente" }),
    ]);

    render(<AlunosView />);

    expect(await screen.findByText("Ana Beatriz Rocha")).toBeInTheDocument();
    expect(screen.getByText("Bruno Costa")).toBeInTheDocument();
  });

  test("filtra a tabela pela busca digitada", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.getList).mockResolvedValue([
      makeAluno({ id: "al-1", nome: "Ana Beatriz Rocha" }),
      makeAluno({ id: "al-2", nome: "Bruno Costa" }),
    ]);

    render(<AlunosView />);
    await screen.findByText("Ana Beatriz Rocha");

    await user.type(screen.getByPlaceholderText(/buscar/i), "bruno");

    await waitFor(() => {
      expect(screen.queryByText("Ana Beatriz Rocha")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Bruno Costa")).toBeInTheDocument();
  });

  test("navega para a ficha ao clicar em uma linha", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.getList).mockResolvedValue([makeAluno({ id: "al-7", nome: "Carla Dias" })]);

    render(<AlunosView />);
    await user.click(await screen.findByText("Carla Dias"));

    expect(push).toHaveBeenCalledWith("/alunos/al-7");
  });

  test("exibe erro quando o carregamento falha", async () => {
    vi.mocked(apiClient.getList).mockRejectedValue(new Error("500"));

    render(<AlunosView />);

    expect(await screen.findByText(/não foi possível carregar/i)).toBeInTheDocument();
  });
});
