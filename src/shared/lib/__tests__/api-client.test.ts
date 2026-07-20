import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { apiClient } from "../api-client";

const API = "http://localhost:3001";

describe("apiClient.getList", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("busca uma coleção e retorna o array tipado", async () => {
    const data = [{ id: "1", nome: "Ana" }];
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => data,
    });

    const result = await apiClient.getList<{ id: string; nome: string }>("alunos");

    expect(fetch).toHaveBeenCalledWith(`${API}/alunos`, expect.any(Object));
    expect(result).toEqual(data);
  });

  test("serializa o objeto de query na URL", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await apiClient.getList("faturas", { status: "vencida", _limit: 5 });

    const calledUrl = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain(`${API}/faturas?`);
    expect(calledUrl).toContain("status=vencida");
    expect(calledUrl).toContain("_limit=5");
  });

  test("lança erro quando a resposta não é ok", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(apiClient.getList("alunos")).rejects.toThrow(/500/);
  });
});

describe("apiClient.getOne", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("busca um recurso por id", async () => {
    const aluno = { id: "7", nome: "Bruno" };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => aluno,
    });

    const result = await apiClient.getOne<typeof aluno>("alunos", "7");

    expect(fetch).toHaveBeenCalledWith(`${API}/alunos/7`, expect.any(Object));
    expect(result).toEqual(aluno);
  });

  test("propaga erro 404", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(apiClient.getOne("alunos", "999")).rejects.toThrow(/404/);
  });
});
