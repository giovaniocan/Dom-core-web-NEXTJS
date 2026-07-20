import { Card } from "@/shared/ui/Card";
import { cn } from "@/shared/lib/cn";
import { DIAS_SEMANA } from "../constants";
import type { Heatmap } from "../types";

const HORAS = Array.from({ length: 24 }, (_, h) => h);
/** Horas com rótulo visível no eixo (evita poluição). */
const HORAS_ROTULO = new Set([0, 6, 9, 12, 15, 18, 21]);

/** Heatmap dia-da-semana × hora dos horários de pico (SVG/CSS puro). */
export function PeakHeatmap({ heatmap }: { heatmap: Heatmap }) {
  const { grid, max } = heatmap;

  return (
    <Card
      title="Horários de pico"
      action={<span className="font-body text-xs text-text-faint">entradas por dia × hora</span>}
    >
      {max === 0 ? (
        <p className="py-10 text-center font-body text-sm text-text-faint">
          Sem entradas registradas no período.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            {/* Eixo de horas */}
            <div
              className="grid items-center"
              style={{ gridTemplateColumns: "2.5rem repeat(24, minmax(0, 1fr))" }}
            >
              <span />
              {HORAS.map((h) => (
                <span
                  key={h}
                  className="text-center font-body text-[10px] tabular-nums text-text-faint"
                >
                  {HORAS_ROTULO.has(h) ? `${h}h` : ""}
                </span>
              ))}
            </div>

            {/* Linhas por dia */}
            <div className="mt-1 space-y-1">
              {DIAS_SEMANA.map((dia, d) => (
                <div
                  key={dia}
                  className="grid items-center gap-0.5"
                  style={{ gridTemplateColumns: "2.5rem repeat(24, minmax(0, 1fr))" }}
                >
                  <span className="font-body text-xs font-semibold text-text-muted">{dia}</span>
                  {HORAS.map((h) => {
                    const count = grid[d][h];
                    const ratio = count / max;
                    return (
                      <div
                        key={h}
                        title={count > 0 ? `${dia} ${h}h · ${count} entradas` : undefined}
                        className={cn(
                          "h-5 rounded-sm",
                          count === 0 ? "bg-card-alt" : "bg-primary",
                        )}
                        style={count > 0 ? { opacity: 0.25 + 0.75 * ratio } : undefined}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legenda */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <span className="font-body text-[10px] text-text-faint">menos</span>
              <div className="flex gap-0.5">
                {[0.25, 0.45, 0.65, 0.85, 1].map((o) => (
                  <span key={o} className="h-3 w-3 rounded-sm bg-primary" style={{ opacity: o }} />
                ))}
              </div>
              <span className="font-body text-[10px] text-text-faint">mais</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
