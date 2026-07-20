import { ScanLine } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { cn } from "@/shared/lib/cn";
import { formatHora } from "../constants";
import type { TerminalInfo } from "../types";

/** Estado das catracas físicas (online/offline, última atividade, total de passagens). */
export function TerminalStatus({ terminais }: { terminais: TerminalInfo[] }) {
  return (
    <Card title="Catracas" flush>
      {terminais.length === 0 ? (
        <p className="px-5 py-10 text-center font-body text-sm text-text-faint">
          Nenhum terminal registrado.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {terminais.map((t) => (
            <li key={t.terminal} className="flex items-center gap-3 px-5 py-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  t.online ? "bg-success/15 text-success" : "bg-card-alt text-text-faint",
                )}
              >
                <ScanLine size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-text-strong">
                  {t.terminal}
                </p>
                <p className="font-body text-xs text-text-muted">
                  última leitura {formatHora(t.ultimaAtividade)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 font-body text-xs font-semibold",
                    t.online ? "text-success" : "text-text-faint",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      t.online ? "bg-success" : "bg-text-faint",
                    )}
                  />
                  {t.online ? "Online" : "Offline"}
                </span>
                <span className="flex items-baseline gap-1">
                  <span className="font-display text-sm tracking-wide text-text-muted">
                    {t.totalPassagens}
                  </span>
                  <span className="font-body text-[10px] uppercase text-text-faint">
                    passagens
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
