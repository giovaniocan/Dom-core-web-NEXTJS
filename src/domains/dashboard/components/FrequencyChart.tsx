import { Card } from "@/shared/ui/Card";
import type { FrequenciaDia } from "../types";

/** Gráfico de barras de frequência (SVG/CSS puro, sem libs externas). */
export function FrequencyChart({ data }: { data: FrequenciaDia[] }) {
  const max = Math.max(1, ...data.map((d) => d.entradas));

  return (
    <Card title="Frequência da semana" action={<span className="font-body text-xs text-text-faint">entradas/dia</span>}>
      <div className="flex h-48 items-end gap-3">
        {data.map((d) => {
          const heightPct = Math.round((d.entradas / max) * 100);
          return (
            <div key={d.dia} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-primary-btn/85 transition-all hover:bg-primary-btn"
                  style={{ height: `${heightPct}%` }}
                  title={`${d.entradas} entradas`}
                />
              </div>
              <span className="font-display text-lg leading-none text-text-strong">
                {d.entradas}
              </span>
              <span className="font-body text-xs text-text-faint">{d.dia}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
