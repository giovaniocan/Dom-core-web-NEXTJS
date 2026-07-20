import { afterEach, describe, expect, test, vi } from "vitest";
import {
  alunosDoProfissional,
  papeisDisponiveis,
  getProfissionaisData,
} from "../services/profissionais-service";
import type { AlunoResumo, Ficha, Profissional } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

function profissional(overrides: Partial<Profissional> = {}): Profissional {
  return {
    id: "pr-1",
    nome: "Rafael Souza",
    papel: "Personal",
    cref: "CREF 012345-G/PR",
    unidadeId: "un-1",
    alunos_ativos: 34,
    foto: "",
    ...overrides,
  };
}

function ficha(overrides: Partial<Ficha> = {}): Ficha {
  return {
    id: "fi-x",
    alunoId: "al-1",
    nome: "Full Body A",
    objetivo: "hipertrofia",
    professor: "Rafael Souza",
    itens: [],
    ...overrides,
  };
}

function aluno(overrides: Partial<AlunoResumo> = {}): AlunoResumo {
  return {
    id: "al-1",
    nome: "Ana Beatriz Rocha",
    foto: "",
    status: "ativo",
    plano: "Student",
    ...overrides,
  };
}

afterEach(() => vi.clearAllMocks());

describe("alunosDoProfissional", () => {
  const alunos: AlunoResumo[] = [
    aluno({ id: "al-1", nome: "Ana Beatriz Rocha" }),
    aluno({ id: "al-2", nome: "Bruno Carvalho" }),
    aluno({ id: "al-3", nome: "Carla Meneghel" }),
  ];

  test("casa fichas pelo nome do professor e mapeia para o aluno", () => {
    const prof = profissional({ nome: "Rafael Souza" });
    const fichas = [
      ficha({ id: "fi-1", alunoId: "al-1", professor: "Rafael Souza" }),
      ficha({ id: "fi-2", alunoId: "al-2", professor: "Diego Prado" }),
    ];

    const carteira = alunosDoProfissional(prof, fichas, alunos);

    expect(carteira.map((a) => a.id)).toEqual(["al-1"]);
    expect(carteira[0].nome).toBe("Ana Beatriz Rocha");
  });

  test("deduplica alunos quando há mais de uma ficha do mesmo aluno", () => {
    const prof = profissional({ nome: "Rafael Souza" });
    const fichas = [
      ficha({ id: "fi-1", alunoId: "al-1", professor: "Rafael Souza" }),
      ficha({ id: "fi-2", alunoId: "al-1", professor: "Rafael Souza" }),
      ficha({ id: "fi-3", alunoId: "al-3", professor: "Rafael Souza" }),
    ];

    const carteira = alunosDoProfissional(prof, fichas, alunos);

    expect(carteira.map((a) => a.id)).toEqual(["al-1", "al-3"]);
  });

  test("retorna carteira vazia quando nenhuma ficha bate com o professor", () => {
    const prof = profissional({ nome: "Camila Nunes" });
    const fichas = [ficha({ alunoId: "al-1", professor: "Rafael Souza" })];

    expect(alunosDoProfissional(prof, fichas, alunos)).toEqual([]);
  });

  test("ignora fichas cujo aluno não existe na coleção", () => {
    const prof = profissional({ nome: "Rafael Souza" });
    const fichas = [ficha({ alunoId: "inexistente", professor: "Rafael Souza" })];

    expect(alunosDoProfissional(prof, fichas, alunos)).toEqual([]);
  });
});

describe("papeisDisponiveis", () => {
  test("retorna a lista distinta de papéis presentes na equipe", () => {
    const profissionais = [
      profissional({ id: "pr-1", papel: "Personal" }),
      profissional({ id: "pr-2", papel: "Nutricionista" }),
      profissional({ id: "pr-3", papel: "Personal" }),
    ];

    expect(papeisDisponiveis(profissionais)).toEqual(["Personal", "Nutricionista"]);
  });

  test("retorna lista vazia quando não há profissionais", () => {
    expect(papeisDisponiveis([])).toEqual([]);
  });
});

describe("getProfissionaisData", () => {
  test("carrega profissionais, fichas e alunos em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "profissionais") return [profissional()] as never;
      if (resource === "fichas") return [ficha()] as never;
      if (resource === "alunos") return [aluno()] as never;
      return [] as never;
    });

    const data = await getProfissionaisData();

    expect(apiClient.getList).toHaveBeenCalledWith("profissionais");
    expect(apiClient.getList).toHaveBeenCalledWith("fichas");
    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
    expect(data.profissionais).toHaveLength(1);
    expect(data.fichas).toHaveLength(1);
    expect(data.alunos).toHaveLength(1);
  });
});
