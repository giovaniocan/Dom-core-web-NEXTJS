import { afterEach, describe, expect, test, vi } from "vitest";
import {
  usuariosAtivos,
  nomeUnidade,
  INTEGRACOES,
  getConfiguracoesData,
} from "../services/configuracoes-service";
import type { Academia, Unidade, Usuario } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

function usuario(overrides: Partial<Usuario> = {}): Usuario {
  return {
    id: "u-x",
    nome: "Fulano",
    email: "fulano@domcore.com.br",
    papel: "recepcao",
    unidadeId: "un-1",
    ativo: true,
    ...overrides,
  };
}

const unidades: Unidade[] = [
  {
    id: "un-1",
    academiaId: "ac-1",
    nome: "Unidade Centro",
    endereco: "R. XV, 1200",
    capacidade: 260,
    catracas: 2,
  },
  {
    id: "un-2",
    academiaId: "ac-1",
    nome: "Unidade Batel",
    endereco: "Av. do Batel, 850",
    capacidade: 180,
    catracas: 1,
  },
];

afterEach(() => vi.clearAllMocks());

describe("usuariosAtivos", () => {
  test("conta apenas os usuários com ativo verdadeiro", () => {
    const usuarios = [
      usuario({ id: "a", ativo: true }),
      usuario({ id: "b", ativo: true }),
      usuario({ id: "c", ativo: false }),
    ];
    expect(usuariosAtivos(usuarios)).toBe(2);
  });

  test("retorna 0 quando a lista está vazia", () => {
    expect(usuariosAtivos([])).toBe(0);
  });
});

describe("nomeUnidade", () => {
  test("resolve o nome da unidade pelo id", () => {
    expect(nomeUnidade("un-2", unidades)).toBe("Unidade Batel");
  });

  test("retorna traço quando o id não corresponde a nenhuma unidade", () => {
    expect(nomeUnidade("inexistente", unidades)).toBe("—");
  });
});

describe("INTEGRACOES", () => {
  test("expõe as três integrações da demo com status conhecido", () => {
    expect(INTEGRACOES).toHaveLength(3);
    expect(INTEGRACOES.map((i) => i.nome)).toEqual([
      "Gateway de pagamento (Asaas)",
      "Catraca facial",
      "Push do app do aluno",
    ]);
    for (const integracao of INTEGRACOES) {
      expect(["conectado", "pendente"]).toContain(integracao.status);
    }
  });
});

describe("getConfiguracoesData", () => {
  const academia: Academia = {
    id: "ac-1",
    nome: "DomCore Gym",
    cidade: "Curitiba",
    estado: "PR",
    cnpj: "42.113.900/0001-55",
    plano_saas: "pro",
  };

  test("carrega academia, unidades, usuários e planos em paralelo", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "academia") return academia as never;
      if (resource === "unidades") return unidades as never;
      if (resource === "usuarios") return [usuario()] as never;
      if (resource === "planos") return [{ id: "pl-1" }] as never;
      return [] as never;
    });

    const data = await getConfiguracoesData();

    expect(apiClient.getList).toHaveBeenCalledWith("academia");
    expect(apiClient.getList).toHaveBeenCalledWith("unidades");
    expect(apiClient.getList).toHaveBeenCalledWith("usuarios");
    expect(apiClient.getList).toHaveBeenCalledWith("planos");
    expect(data.academia.nome).toBe("DomCore Gym");
    expect(data.unidades).toHaveLength(2);
    expect(data.usuarios).toHaveLength(1);
    expect(data.planos).toHaveLength(1);
  });

  test("inclui a lista estática de integrações no payload", async () => {
    vi.mocked(apiClient.getList).mockImplementation(async (resource: string) => {
      if (resource === "academia") return academia as never;
      return [] as never;
    });

    const data = await getConfiguracoesData();

    expect(data.integracoes).toEqual(INTEGRACOES);
  });
});
