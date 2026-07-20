import type { ChartDatum } from "../types";

interface LineChartProps {
  data: ChartDatum[];
  /** Formata o valor exibido sob cada ponto. Default: número cru. */
  formatValue?: (value: number) => string;
}

const VIEW_W = 100;
const VIEW_H = 60;

/** Gráfico de linha em SVG inline (linha + área), escalado ao maior valor. */
export function LineChart({ data, formatValue = (v) => String(v) }: LineChartProps) {
  if (data.length === 0) return <ChartEmpty />;

  const max = Math.max(...data.map((d) => d.value), 1);
  const n = data.length;
  const xAt = (i: number): number => (n === 1 ? VIEW_W / 2 : (i / (n - 1)) * VIEW_W);
  const yAt = (v: number): number => VIEW_H - (v / max) * VIEW_H;

  const line = data.map((d, i) => `${xAt(i)},${yAt(d.value)}`).join(" ");
  const area = `${xAt(0)},${VIEW_H} ${line} ${xAt(n - 1)},${VIEW_H}`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de linha"
        className="h-44 w-full"
      >
        <polygon points={area} className="fill-primary-btn opacity-10" />
        <polyline
          points={line}
          fill="none"
          className="stroke-primary"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => (
          <circle
            key={d.label}
            data-testid="point"
            cx={xAt(i)}
            cy={yAt(d.value)}
            r={2.5}
            className="fill-primary"
            vectorEffect="non-scaling-stroke"
          >
            <title>{`${d.label}: ${formatValue(d.value)}`}</title>
          </circle>
        ))}
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
