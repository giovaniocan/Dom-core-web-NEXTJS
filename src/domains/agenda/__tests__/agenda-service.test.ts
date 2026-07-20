import { afterEach, describe, expect, test, vi } from "vitest";
import {
  getAulas,
  getUnidades,
  getAlunosLite,
  ocupacaoPct,
  vagasRestantes,
  isLotada,
  ocupacaoTone,
  uniqueHorarios,
  buildWeekGrid,
  weekStats,
  modalidadeAccent,
  buildRoster,
  DIAS_SEMANA,
} from "../services/agenda-service";
import type { Aula, AlunoLite } from "../types";
import { apiClient } from "@/shared/lib/api-client";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { getList: vi.fn(), getOne: vi.fn() },
}));

const aulas: Aula[] = [
  { id: "au-1", nome: "Spinning", professor: "Rafael", unidadeId: "un-1", dia: "Seg", hora: "07:00", vagas: 20, inscritos: 18 },
  { id: "au-2", nome: "Funcional", professor: "Rafael", unidadeId: "un-1", dia: "Seg", hora: "19:00", vagas: 24, inscritos: 24 },
  { id: "au-3", nome: "Yoga", professor: "Camila", unidadeId: "un-2", dia: "Ter", hora: "08:00", vagas: 15, inscritos: 12 },
];

afterEach(() => vi.clearAllMocks());

describe("getAulas", () => {
  test("lista a coleção 'aulas' sem filtro quando não há unidade", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue(aulas);
    const result = await getAulas();
    expect(apiClient.getList).toHaveBeenCalledWith("aulas", undefined);
    expect(result).toEqual(aulas);
  });

  test("filtra por unidadeId quando informado", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue(aulas);
    await getAulas("un-1");
    expect(apiClient.getList).toHaveBeenCalledWith("aulas", { unidadeId: "un-1" });
  });
});

describe("getUnidades / getAlunosLite", () => {
  test("getUnidades consome a coleção 'unidades'", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue([]);
    await getUnidades();
    expect(apiClient.getList).toHaveBeenCalledWith("unidades");
  });

  test("getAlunosLite consome a coleção 'alunos'", async () => {
    vi.mocked(apiClient.getList).mockResolvedValue([]);
    await getAlunosLite();
    expect(apiClient.getList).toHaveBeenCalledWith("alunos");
  });
});

describe("cálculos de ocupação", () => {
  test("ocupacaoPct calcula e arredonda o percentual", () => {
    expect(ocupacaoPct(aulas[0])).toBe(90);
    expect(ocupacaoPct({ ...aulas[0], inscritos: 24, vagas: 24 })).toBe(100);
  });

  test("ocupacaoPct trata vagas 0 sem dividir por zero", () => {
    expect(ocupacaoPct({ ...aulas[0], vagas: 0, inscritos: 3 })).toBe(0);
  });

  test("vagasRestantes nunca fica negativo", () => {
    expect(vagasRestantes(aulas[0])).toBe(2);
    expect(vagasRestantes({ ...aulas[0], inscritos: 25, vagas: 20 })).toBe(0);
  });

  test("isLotada true quando inscritos alcançam as vagas", () => {
    expect(isLotada(aulas[1])).toBe(true);
    expect(isLotada(aulas[0])).toBe(false);
  });

  test("ocupacaoTone vira danger quando lotada, warning quando cheia, success caso contrário", () => {
    expect(ocupacaoTone(100)).toBe("danger");
    expect(ocupacaoTone(85)).toBe("warning");
    expect(ocupacaoTone(40)).toBe("success");
  });
});

describe("grade semanal", () => {
  test("uniqueHorarios retorna horários distintos ordenados", () => {
    expect(uniqueHorarios(aulas)).toEqual(["07:00", "08:00", "19:00"]);
  });

  test("buildWeekGrid posiciona a aula no slot [hora][dia] correto", () => {
    const grid = buildWeekGrid(aulas);
    expect(grid.horarios).toEqual(["07:00", "08:00", "19:00"]);
    expect(grid.dias).toContain("Seg");
    expect(grid.matrix["07:00"]["Seg"].map((a) => a.id)).toEqual(["au-1"]);
    expect(grid.matrix["19:00"]["Seg"].map((a) => a.id)).toEqual(["au-2"]);
    expect(grid.matrix["08:00"]["Seg"]).toEqual([]);
  });

  test("DIAS_SEMANA começa na segunda", () => {
    expect(DIAS_SEMANA[0]).toBe("Seg");
  });

  test("weekStats agrega total, ocupação média, lotadas e vagas abertas", () => {
    const stats = weekStats(aulas);
    expect(stats.totalAulas).toBe(3);
    expect(stats.lotadas).toBe(1);
    expect(stats.vagasAbertas).toBe(5); // (20-18)+(24-24)+(15-12)
    expect(stats.ocupacaoMedia).toBe(Math.round((90 + 100 + 80) / 3));
  });
});

describe("modalidadeAccent", () => {
  test("é determinística para o mesmo nome", () => {
    expect(modalidadeAccent("Spinning")).toEqual(modalidadeAccent("Spinning"));
  });

  test("retorna classes token para nomes desconhecidos", () => {
    const accent = modalidadeAccent("Modalidade Inexistente");
    expect(accent.bar).toMatch(/^bg-/);
    expect(accent.text).toMatch(/^text-/);
  });
});

describe("buildRoster", () => {
  const pool: AlunoLite[] = Array.from({ length: 24 }, (_, i) => ({
    id: `al-${i + 1}`,
    nome: `Aluno ${i + 1}`,
    foto: undefined,
  }));

  test("tem tamanho min(inscritos, alunos disponíveis)", () => {
    expect(buildRoster({ id: "au-1", inscritos: 18 }, pool)).toHaveLength(18);
    expect(buildRoster({ id: "au-x", inscritos: 100 }, pool)).toHaveLength(24);
  });

  test("é determinística e não repete alunos", () => {
    const a = buildRoster({ id: "au-1", inscritos: 10 }, pool);
    const b = buildRoster({ id: "au-1", inscritos: 10 }, pool);
    expect(a).toEqual(b);
    const ids = a.map((e) => e.alunoId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("cada entrada carrega presença booleana", () => {
    const roster = buildRoster({ id: "au-2", inscritos: 6 }, pool);
    expect(roster.every((e) => typeof e.presente === "boolean")).toBe(true);
  });
});
