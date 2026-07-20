import { describe, expect, test } from "vitest";
import { formatBRL, formatDate, formatDateTime, formatRelativeDays } from "../format";

describe("formatBRL", () => {
  test("formata número inteiro em moeda BRL", () => {
    expect(formatBRL(1500)).toBe("R$ 1.500,00");
  });

  test("formata valor com centavos", () => {
    expect(formatBRL(99.9)).toBe("R$ 99,90");
  });

  test("formata zero", () => {
    expect(formatBRL(0)).toBe("R$ 0,00");
  });

  test("retorna traço para valor nulo/indefinido", () => {
    expect(formatBRL(null)).toBe("—");
    expect(formatBRL(undefined)).toBe("—");
  });
});

describe("formatDate", () => {
  test("formata data ISO em pt-BR (dd/mm/aaaa)", () => {
    expect(formatDate("2026-07-20")).toBe("20/07/2026");
  });

  test("retorna traço para entrada vazia", () => {
    expect(formatDate("")).toBe("—");
    expect(formatDate(null)).toBe("—");
  });
});

describe("formatDateTime", () => {
  test("formata timestamp com hora em pt-BR", () => {
    const result = formatDateTime("2026-07-20T08:30:00");
    expect(result).toContain("20/07/2026");
    expect(result).toContain("08:30");
  });
});

describe("formatRelativeDays", () => {
  test("retorna 'hoje' quando a data é hoje", () => {
    const hoje = new Date().toISOString().slice(0, 10);
    expect(formatRelativeDays(hoje)).toBe("hoje");
  });

  test("retorna 'há 1 dia' para ontem", () => {
    const ontem = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    expect(formatRelativeDays(ontem)).toBe("há 1 dia");
  });

  test("retorna 'há N dias' para datas passadas", () => {
    const tresDias = new Date(Date.now() - 3 * 86_400_000).toISOString().slice(0, 10);
    expect(formatRelativeDays(tresDias)).toBe("há 3 dias");
  });
});
