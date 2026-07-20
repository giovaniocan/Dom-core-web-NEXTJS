import { Info } from "lucide-react";
import { Card } from "@/shared/ui/Card";

interface Preferencia {
  rotulo: string;
  valor: string;
  hint: string;
}

/** Preferências de demonstração (somente leitura nesta versão). */
const PREFERENCIAS: ReadonlyArray<Preferencia> = [
  { rotulo: "Idioma", valor: "Português (pt-BR)", hint: "Idioma da interface e dos e-mails." },
  { rotulo: "Fuso horário", valor: "America/Sao_Paulo (GMT-3)", hint: "Base para vencimentos e relatórios." },
  { rotulo: "Moeda", valor: "Real brasileiro (BRL)", hint: "Formatação de valores financeiros." },
  { rotulo: "Formato de data", valor: "DD/MM/AAAA", hint: "Exibição de datas no sistema." },
];

/** Aba "Preferências": ajustes gerais em modo leitura + nota sobre o tema. */
export function PreferenciasPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-card border border-border bg-card-alt/60 px-4 py-3">
        <Info size={18} className="mt-0.5 shrink-0 text-primary" />
        <p className="font-body text-sm text-text-muted">
          O tema claro/escuro é controlado pelo botão na barra superior (Topbar). As demais
          preferências abaixo são exibidas em modo leitura nesta demonstração.
        </p>
      </div>

      <Card flush title="Preferências do sistema">
        <div className="divide-y divide-border">
          {PREFERENCIAS.map((pref) => (
            <div key={pref.rotulo} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-body text-sm font-semibold text-text-strong">{pref.rotulo}</p>
                <p className="mt-0.5 font-body text-xs text-text-faint">{pref.hint}</p>
              </div>
              <span className="font-body text-sm text-text-muted">{pref.valor}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
