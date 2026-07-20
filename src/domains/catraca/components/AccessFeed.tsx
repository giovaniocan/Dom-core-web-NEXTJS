import { LogIn, LogOut } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { Avatar } from "@/shared/ui/Avatar";
import { StatusPill } from "@/shared/ui/StatusPill";
import { cn } from "@/shared/lib/cn";
import { formatHora } from "../constants";
import type { Acesso } from "../types";

/** Feed das últimas passagens na catraca (entrada/saída, liberado/negado + motivo). */
export function AccessFeed({ passes }: { passes: Acesso[] }) {
  return (
    <Card
      title="Passagens ao vivo"
      action={<span className="font-body text-xs text-text-faint">últimas leituras</span>}
      flush
    >
      {passes.length === 0 ? (
        <p className="px-5 py-10 text-center font-body text-sm text-text-faint">
          Nenhuma passagem registrada ainda.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {passes.map((p) => {
            const negado = p.resultado === "negado";
            const entrada = p.sentido === "entrada";
            return (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={p.aluno} src={p.foto || undefined} size="sm" />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-semibold text-text-strong">
                    {p.aluno}
                  </p>
                  <p className="flex items-center gap-1.5 truncate font-body text-xs text-text-muted">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-semibold",
                        entrada ? "text-success" : "text-text-muted",
                      )}
                    >
                      {entrada ? <LogIn size={12} /> : <LogOut size={12} />}
                      {entrada ? "Entrada" : "Saída"}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="truncate">{p.terminal}</span>
                  </p>
                  {negado && p.motivo && (
                    <p className="mt-0.5 font-body text-xs font-medium text-danger">{p.motivo}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StatusPill status={p.resultado} />
                  <span className="font-display text-sm tracking-wide text-text-faint">
                    {formatHora(p.timestamp)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
