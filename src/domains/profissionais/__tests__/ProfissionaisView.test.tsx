import { afterEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { ProfissionaisView } from "../components/ProfissionaisView";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

const profissionais = [
  { id: "pr-1", nome: "Rafael Souza", papel: "Personal", cref: "CREF 1", unidadeId: "un-1", alunos_ativos: 34, foto: "" },
  { id: "pr-2", nome: "Camila Nunes", papel: "Nutricionista", cref: "CRN 45678", unidadeId: "un-2", alunos_ativos: 22, foto: "" },
  { id: "pr-3", nome: "Diego Prado", papel: "Personal", cref: "CREF 2", unidadeId: "un-2", alunos_ativos: 28, foto: "" },
];

const fichas = [
  { id: "fi-1", alunoId: "al-1", nome: "Full Body A", objetivo: "hipertrofia", professor: "Rafael Souza", itens: [] },
];

const alunos = [{ id: "al-1", nome: "Ana Beatriz Rocha", foto: "", status: "ativo", plano: "Student" }];

function mockApi() {
  vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
    if (resource === "profissionais") return profissionais as never;
    if (resource === "fichas") return fichas as never;
    if (resource === "alunos") return alunos as never;
    return [] as never;
  });
}

afterEach(() => vi.clearAllMocks());

describe("ProfissionaisView", () => {
  test("lista todos os profissionais da equipe", async () => {
    mockApi();
    render(<ProfissionaisView />);

    expect(await screen.findByText("Rafael Souza")).toBeInTheDocument();
    expect(screen.getByText("Camila Nunes")).toBeInTheDocument();
    expect(screen.getByText("Diego Prado")).toBeInTheDocument();
  });

  test("filtra a equipe pelo papel selecionado", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<ProfissionaisView />);
    await screen.findByText("Rafael Souza");

    await user.click(screen.getByRole("button", { name: "Nutricionista" }));

    expect(screen.getByText("Camila Nunes")).toBeInTheDocument();
    expect(screen.queryByText("Rafael Souza")).not.toBeInTheDocument();
    expect(screen.queryByText("Diego Prado")).not.toBeInTheDocument();
  });

  test("abre a carteira com os alunos derivados das fichas ao clicar no card", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<ProfissionaisView />);
    await screen.findByText("Rafael Souza");

    await user.click(screen.getByRole("button", { name: /rafael souza/i }));

    expect(await screen.findByText("Ana Beatriz Rocha")).toBeInTheDocument();
  });

  test("mostra estado vazio na carteira de quem não tem alunos com ficha", async () => {
    mockApi();
    const user = userEvent.setup();
    render(<ProfissionaisView />);
    await screen.findByText("Camila Nunes");

    await user.click(screen.getByRole("button", { name: /camila nunes/i }));

    expect(await screen.findByText(/nenhum aluno/i)).toBeInTheDocument();
  });
});
