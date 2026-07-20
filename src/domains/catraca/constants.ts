/** Rótulos curtos dos dias da semana, indexados por getUTCDay() (0 = domingo). */
export const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

/** Formata um timestamp ISO como hora local pt-BR (HH:mm). */
export function formatHora(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
