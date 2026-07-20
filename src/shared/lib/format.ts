const EMPTY = "—";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um número como moeda BRL. Retorna "—" quando nulo/indefinido. */
export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  // Intl usa espaço não separável (U+00A0/U+202F) entre "R$" e o número; normaliza para espaço comum.
  return brlFormatter.format(value).replace(/[  ]/g, " ");
}

/** Interpreta uma string de data (ISO ou "aaaa-mm-dd") sem sofrer timezone shift. */
function parseDate(value: string): Date {
  // Datas puras "aaaa-mm-dd" são tratadas como locais (evita voltar 1 dia em UTC-3).
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

/** Formata data em pt-BR: dd/mm/aaaa. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return EMPTY;
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return EMPTY;
  return date.toLocaleDateString("pt-BR");
}

/** Formata data + hora em pt-BR: dd/mm/aaaa HH:mm. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return EMPTY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Descreve há quantos dias uma data ocorreu, em pt-BR ("hoje", "há 1 dia", "há N dias"). */
export function formatRelativeDays(value: string | null | undefined): string {
  if (!value) return EMPTY;
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return EMPTY;

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = startOfDay(new Date()).getTime() - startOfDay(date).getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays <= 0) return "hoje";
  if (diffDays === 1) return "há 1 dia";
  return `há ${diffDays} dias`;
}
