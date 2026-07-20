import type { ChartDatum } from "../types";

interface BarChartProps {
  data: ChartDatum[];
  /** Formata o valor exibido acima de cada barra. Default: número cru. */
  formatValue?: (value: number) => string;
}

const VIEW_W = 100;
const VIEW_H = 60;
const GAP = 4;

/** Gráfico de barras vertical em SVG inline, escalado ao maior valor. */
export function BarChart({ data, formatValue = (v) => String(v) }: BarChartProps) {
  if (data.length === 0) return <ChartEmpty />;

  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = VIEW_W / data.length;
  const barW = Math.max(slot - GAP, 1);

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de barras"
        className="h-44 w-full"
      >
        {data.map((d, i) => {
          const h = d.value > 0 ? Math.max((d.value / max) * VIEW_H, 1) : 0;
          const x = i * slot + (slot - barW) / 2;
          const y = VIEW_H - h;
          return (
            <rect
              key={d.label}
              data-testid="bar"
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={1}
              className="fill-primary-btn"
            >
              <title>{`${d.label}: ${formatValue(d.value)}`}</title>
            </rect>
          );
        })}
      </svg>

      <div className="mt-3 flex">
        {data.map((d) => (
          <div key={d.label} className="min-w-0 flex-1 px-1 text-center">
            <div className="font-display text-sm tracking-wide text-text-strong">
              {formatValue(d.value)}
            </div>
            <div className="truncate font-body text-[11px] text-text-faint">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-44 items-center justify-center rounded-card border border-dashed border-border">
      <span className="font-body text-sm text-text-faint">Sem dados para exibir.</span>
    </div>
  );
}
