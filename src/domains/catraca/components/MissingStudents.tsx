import { UserX } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { Avatar } from "@/shared/ui/Avatar";
import { StatusPill } from "@/shared/ui/StatusPill";
import { formatDate } from "@/shared/lib/format";
import type { AlunoSumido } from "../types";

/** Lista de alunos sumidos (sem visita há vários dias) para reengajamento. */
export function MissingStudents({ sumidos }: { sumidos: AlunoSumido[] }) {
  return (
    <Card
      title="Alunos sumidos"
      action={
        <span className="font-display text-lg tracking-wide text-danger">{sumidos.length}</span>
      }
      flush
    >
      {sumidos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <UserX size={28} strokeWidth={1.5} className="text-text-faint" />
          <p className="font-body text-sm text-text-faint">
            Ninguém sumido — todo mundo frequentando!
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {sumidos.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar name={s.nome} src={s.foto || undefined} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-text-strong">
                  {s.nome}
                </p>
                <p className="font-body text-xs text-text-muted">
                  Última visita {formatDate(s.ultima_visita)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-display text-lg leading-none tracking-wide text-danger">
                  {s.diasAusente} dias
                </span>
                <StatusPill status={s.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
