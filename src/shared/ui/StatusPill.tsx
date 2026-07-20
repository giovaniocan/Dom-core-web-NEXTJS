import { cn } from "@/shared/lib/cn";

type Tone = "success" | "danger" | "warning" | "neutral" | "info";

interface StatusMeta {
  label: string;
  tone: Tone;
}

/** Mapa central de status do domínio (aluno, fatura, acesso...) para rótulo + tom. */
const STATUS_MAP: Record<string, StatusMeta> = {
  // Alunos
  ativo: { label: "Ativo", tone: "success" },
  inadimplente: { label: "Inadimplente", tone: "danger" },
  trancado: { label: "Trancado", tone: "warning" },
  cancelado: { label: "Cancelado", tone: "neutral" },
  // Faturas
  paga: { label: "Paga", tone: "success" },
  aberta: { label: "Aberta", tone: "warning" },
  vencida: { label: "Vencida", tone: "danger" },
  // Acessos / catraca
  liberado: { label: "Liberado", tone: "success" },
  negado: { label: "Negado", tone: "danger" },
  // Agenda / presença
  presente: { label: "Presente", tone: "success" },
  ausente: { label: "Ausente", tone: "neutral" },
  // Genéricos
  pendente: { label: "Pendente", tone: "warning" },
  concluido: { label: "Concluído", tone: "success" },
};

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
  neutral: "bg-card-alt text-text-muted",
  info: "bg-silver/20 text-text-muted",
};

export interface StatusPillProps {
  status: string;
  /** Sobrescreve o rótulo derivado do mapa. */
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const meta = STATUS_MAP[status];
  const tone: Tone = meta?.tone ?? "neutral";
  const text = label ?? meta?.label ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs font-semibold",
        TONE_CLASS[tone],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "success" && "bg-success",
          tone === "danger" && "bg-danger",
          tone === "warning" && "bg-warning",
          (tone === "neutral" || tone === "info") && "bg-text-faint",
        )}
      />
      {text}
    </span>
  );
}
