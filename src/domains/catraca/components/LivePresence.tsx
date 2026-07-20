import { Users } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { Avatar } from "@/shared/ui/Avatar";
import { formatHora } from "../constants";
import type { PresencaAluno } from "../types";

/** Grade "quem está na academia agora" — última passagem liberada foi entrada. */
export function LivePresence({ presentes }: { presentes: PresencaAluno[] }) {
  return (
    <Card
      title="Na academia agora"
      action={
        <span className="inline-flex items-center gap-1.5 font-display text-2xl leading-none tracking-wide text-primary">
          <Users size={16} className="mb-0.5" />
          {presentes.length}
        </span>
      }
    >
      {presentes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Users size={28} strokeWidth={1.5} className="text-text-faint" />
          <p className="font-body text-sm text-text-faint">Academia vazia no momento.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {presentes.map((p) => (
            <li
              key={p.alunoId}
              className="flex items-center gap-3 rounded-lg border border-border bg-card-alt/50 px-3 py-2"
            >
              <Avatar name={p.aluno} src={p.foto || undefined} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-text-strong">
                  {p.aluno}
                </p>
                <p className="truncate font-body text-xs text-text-muted">{p.terminal}</p>
              </div>
              <span className="shrink-0 font-body text-xs text-text-faint">
                desde {formatHora(p.desde)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
