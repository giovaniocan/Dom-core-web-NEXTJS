import type { Adesao } from "../types";

const SIZE = 140;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

/** Anel SVG local: % de refeições marcadas como feitas no dia. */
export function AdesaoChart({ adesao }: { adesao: Adesao }) {
  const { feitas, total, percent } = adesao;
  const offset = CIRC - (Math.max(0, Math.min(100, percent)) / 100) * CIRC;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`Adesão de ${percent}%`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-card-alt"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            className="stroke-success transition-all"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl leading-none tracking-wide text-text-strong">
            {percent}%
          </span>
          <span className="mt-1 font-body text-xs text-text-faint">adesão</span>
        </div>
      </div>
      <p className="font-body text-sm text-text-muted">
        <span className="font-semibold text-text-strong">{feitas}</span> de {total} refeições feitas
      </p>
    </div>
  );
}
