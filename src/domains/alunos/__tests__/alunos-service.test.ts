import { afterEach, describe, expect, test, vi } from "vitest";
import {
  getAlunos,
  getAluno,
  getAlunoDetalhe,
  filterAlunos,
  planoOptions,
  summarizeFaturas,
  rankingPosicao,
  contarPorStatus,
  nivelFromXp,
  conquistas,
} from "../services/alunos-service";
import type { Aluno, Fatura, RankingEntry } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

afterEach(() => vi.clearAllMocks());

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

function makeFatura(over: Partial<Fatura> = {}): Fatura {
  return {
    id: "ft-1",
    alunoId: "al-1",
    aluno: "Ana Beatriz Rocha",
    contratoId: "ct-1",
    competencia: "2026-06",
    vencimento: "2026-06-20",
    valor: 100,
    status: "paga",
    meio: "pix",
    pago_em: "2026-06-19",
    tentativas_cobranca: 0,
    ultima_tentativa: null,
    ...over,
  };
}

describe("getAlunos", () => {
  test("lista a coleção 'alunos'", async () => {
    const alunos = [makeAluno()];
    vi.mocked(apiClient.getList).mockResolvedValue(alunos);

    const result = await getAlunos();

    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
    expect(result).toEqual(alunos);
  });
});

describe("getAluno", () => {
  test("busca um aluno pelo id", async () => {
    const aluno = makeAluno({ id: "al-9" });
    vi.mocked(apiClient.getOne).mockResolvedValue(aluno);

    const result = await getAluno("al-9");

    expect(apiClient.getOne).toHaveBeenCalledWith("alunos", "al-9");
    expect(result).toEqual(aluno);
  });
});

describe("getAlunoDetalhe", () => {
  test("agrega aluno + faturas + acessos + fichas + exercicios + ranking", async () => {
    const aluno = makeAluno({ id: "al-1" });
    vi.mocked(apiClient.getOne).mockResolvedValue(aluno);
    vi.mocked(apiClient.getList).mockResolvedValue([]);

    const result = await getAlunoDetalhe("al-1");

    expect(apiClient.getOne).toHaveBeenCalledWith("alunos", "al-1");
    expect(apiClient.getList).toHaveBeenCalledWith("faturas", { alunoId: "al-1" });
    expect(apiClient.getList).toHaveBeenCalledWith("acessos", { alunoId: "al-1" });
    expect(apiClient.getList).toHaveBeenCalledWith("fichas", { alunoId: "al-1" });
    expect(apiClient.getList).toHaveBeenCalledWith("exercicios");
    expect(apiClient.getList).toHaveBeenCalledWith("ranking");
    expect(result.aluno).toEqual(aluno);
  });
});

describe("filterAlunos", () => {
  const alunos = [
    makeAluno({ id: "al-1", nome: "Ana Beatriz", status: "ativo", plano: "Student", matricula: "2025-08-18", telefone: "(41) 90000-0001" }),
    makeAluno({ id: "al-2", nome: "Bruno Costa", status: "inadimplente", plano: "Mensal", telefone: "(41) 90000-0002" }),
    makeAluno({ id: "al-3", nome: "Carla Dias", status: "trancado", plano: "Anual Black", telefone: "(41) 90000-0003" }),
  ];

  test("sem filtros retorna todos", () => {
    expect(filterAlunos(alunos, { search: "", status: "todos", plano: "todos" })).toHaveLength(3);
  });

  test("filtra por status", () => {
    const r = filterAlunos(alunos, { search: "", status: "inadimplente", plano: "todos" });
    expect(r.map((a) => a.id)).toEqual(["al-2"]);
  });

  test("filtra por plano", () => {
    const r = filterAlunos(alunos, { search: "", status: "todos", plano: "Anual Black" });
    expect(r.map((a) => a.id)).toEqual(["al-3"]);
  });

  test("busca por nome (case-insensitive)", () => {
    const r = filterAlunos(alunos, { search: "bruno", status: "todos", plano: "todos" });
    expect(r.map((a) => a.id)).toEqual(["al-2"]);
  });

  test("busca por telefone", () => {
    const r = filterAlunos(alunos, { search: "0003", status: "todos", plano: "todos" });
    expect(r.map((a) => a.id)).toEqual(["al-3"]);
  });

  test("combina busca e status", () => {
    const r = filterAlunos(alunos, { search: "a", status: "ativo", plano: "todos" });
    expect(r.map((a) => a.id)).toEqual(["al-1"]);
  });
});

describe("planoOptions", () => {
  test("retorna planos únicos ordenados", () => {
    const alunos = [
      makeAluno({ plano: "Mensal" }),
      makeAluno({ plano: "Student" }),
      makeAluno({ plano: "Mensal" }),
    ];
    expect(planoOptions(alunos)).toEqual(["Mensal", "Student"]);
  });
});

describe("summarizeFaturas", () => {
  test("soma pago, em aberto e vencido separadamente", () => {
    const faturas = [
      makeFatura({ status: "paga", valor: 100 }),
      makeFatura({ status: "aberta", valor: 50 }),
      makeFatura({ status: "vencida", valor: 349.9 }),
      makeFatura({ status: "vencida", valor: 10 }),
    ];
    const r = summarizeFaturas(faturas);
    expect(r.totalFaturas).toBe(4);
    expect(r.totalPago).toBe(100);
    expect(r.emAberto).toBe(50);
    expect(r.vencido).toBeCloseTo(359.9, 2);
    expect(r.vencidas).toBe(2);
  });

  test("lista vazia zera tudo", () => {
    expect(summarizeFaturas([])).toEqual({
      totalFaturas: 0,
      totalPago: 0,
      emAberto: 0,
      vencido: 0,
      vencidas: 0,
    });
  });
});

describe("rankingPosicao", () => {
  const ranking: RankingEntry[] = [
    { id: "rk-1", posicao: 1, alunoId: "al-12", nome: "Leo", xp: 4122, streak: 5 },
    { id: "rk-2", posicao: 2, alunoId: "al-24", nome: "Yasmin", xp: 3824, streak: 20 },
  ];

  test("retorna a posição do aluno quando presente", () => {
    expect(rankingPosicao(ranking, "al-24")).toBe(2);
  });

  test("retorna null quando o aluno não está no ranking", () => {
    expect(rankingPosicao(ranking, "al-99")).toBeNull();
  });
});

describe("contarPorStatus", () => {
  test("conta total e cada status", () => {
    const alunos = [
      makeAluno({ status: "ativo" }),
      makeAluno({ status: "ativo" }),
      makeAluno({ status: "inadimplente" }),
      makeAluno({ status: "trancado" }),
    ];
    expect(contarPorStatus(alunos)).toEqual({
      total: 4,
      ativo: 2,
      inadimplente: 1,
      trancado: 1,
    });
  });

  test("lista vazia zera contadores", () => {
    expect(contarPorStatus([])).toEqual({ total: 0, ativo: 0, inadimplente: 0, trancado: 0 });
  });
});

describe("nivelFromXp", () => {
  test("nível 1 no início da faixa", () => {
    expect(nivelFromXp(0)).toEqual({ nivel: 1, xpNoNivel: 0, xpParaProximo: 1000, pct: 0 });
  });

  test("progresso dentro do nível", () => {
    const r = nivelFromXp(1760);
    expect(r.nivel).toBe(2);
    expect(r.xpNoNivel).toBe(760);
    expect(r.xpParaProximo).toBe(240);
    expect(r.pct).toBeCloseTo(76, 5);
  });

  test("xp negativo é tratado como zero", () => {
    expect(nivelFromXp(-50)).toEqual({ nivel: 1, xpNoNivel: 0, xpParaProximo: 1000, pct: 0 });
  });
});

describe("conquistas", () => {
  test("marca earned conforme xp, streak, status e pódio", () => {
    const lista = conquistas({ xp: 3200, streak: 16, status: "ativo" }, 2);
    const earned = lista.filter((c) => c.earned).map((c) => c.id);
    expect(earned).toContain("primeiro-milhar");
    expect(earned).toContain("elite-xp");
    expect(earned).toContain("ofensiva");
    expect(earned).toContain("podio");
    expect(earned).toContain("assiduo");
    expect(earned).not.toContain("maratonista");
  });

  test("aluno iniciante desbloqueia poucas conquistas", () => {
    const lista = conquistas({ xp: 120, streak: 1, status: "trancado" }, null);
    expect(lista.filter((c) => c.earned)).toHaveLength(0);
    expect(lista.length).toBeGreaterThan(0);
  });
});
