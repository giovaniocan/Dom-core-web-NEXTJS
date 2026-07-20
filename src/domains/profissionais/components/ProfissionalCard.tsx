import { Users } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { Badge, type BadgeTone } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import type { Profissional } from "../types";

/** Tom do selo por papel — cai em neutro para papéis não mapeados. */
const PAPEL_TONE: Record<string, BadgeTone> = {
  Personal: "primary",
  Nutricionista: "success",
};

export interface ProfissionalCardProps {
  profissional: Profissional;
  onClick?: (profissional: Profissional) => void;
}

/** Card clicável de um profissional: avatar, papel, CREF e contagem de alunos ativos. */
export function ProfissionalCard({ profissional, onClick }: ProfissionalCardProps) {
  const tone = PAPEL_TONE[profissional.papel] ?? "neutral";

  const handleActivate = () => onClick?.(profissional);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      className="cursor-pointer transition-colors hover:border-primary/40 hover:bg-card-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start gap-4">
        <Avatar name={profissional.nome} src={profissional.foto || undefined} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-body text-base font-semibold text-text-strong">
              {profissional.nome}
            </h3>
            <Badge tone={tone}>{profissional.papel}</Badge>
          </div>

          <p className="mt-0.5 font-body text-xs text-text-faint">{profissional.cref}</p>

          <div className="mt-3 flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span className="font-display text-2xl leading-none tracking-wide text-text-strong">
              {profissional.alunos_ativos}
            </span>
            <span className="font-body text-xs text-text-muted">alunos ativos</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
