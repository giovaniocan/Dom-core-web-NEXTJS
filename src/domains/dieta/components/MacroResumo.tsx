import { ProgressBar, type ProgressTone } from "@/shared/ui/ProgressBar";
import type { MacroTotais } from "../types";

interface MacroConfig {
  key: keyof MacroTotais;
  label: string;
  unit: string;
  tone: ProgressTone;
}

const MACROS: MacroConfig[] = [
  { key: "kcal", label: "Calorias", unit: "kcal", tone: "primary" },
  { key: "proteina", label: "Proteína", unit: "g", tone: "success" },
  { key: "carbo", label: "Carboidrato", unit: "g", tone: "warning" },
  { key: "gordura", label: "Gordura", unit: "g", tone: "primary" },
];

/** Metas vs somatório do dia: uma ProgressBar por macro (soma / meta). */
export function MacroResumo({ metas, soma }: { metas: MacroTotais; soma: MacroTotais }) {
  return (
    <div className="space-y-4">
      {MACROS.map((m) => {
        const s = soma[m.key];
        const meta = metas[m.key];
        const pct = meta > 0 ? (s / meta) * 100 : 0;
        return (
          <div key={m.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="font-body text-sm font-medium text-text-strong">{m.label}</span>
              <span className="font-body text-xs text-text-muted">
                {`${s} / ${meta} ${m.unit}`}
              </span>
            </div>
            <ProgressBar value={pct} tone={m.tone} showLabel />
          </div>
        );
      })}
    </div>
  );
}
