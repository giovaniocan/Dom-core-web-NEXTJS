import type { ReactNode } from "react";
import { Mail, Phone, CalendarClock, CalendarCheck, IdCard, Cake } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { StatTile } from "@/shared/ui/StatTile";
import { StatusPill } from "@/shared/ui/StatusPill";
import { formatBRL, formatDate, formatRelativeDays } from "@/shared/lib/format";
import { rankingPosicao, summarizeFaturas } from "../services/alunos-service";
import type { AlunoDetalhe } from "../types";

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-faint">{icon}</span>
      <div className="min-w-0">
        <p className="font-body text-xs uppercase tracking-wide text-text-faint">{label}</p>
        <p className="truncate font-body text-sm text-text-strong">{value}</p>
      </div>
    </div>
  );
}

export interface ResumoTabProps {
  detalhe: AlunoDetalhe;
}

export function ResumoTab({ detalhe }: ResumoTabProps) {
  const { aluno, faturas, acessos, ranking } = detalhe;
  const resumo = summarizeFaturas(faturas);
  const posicao = rankingPosicao(ranking, aluno.id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Situação"
          value={<StatusPill status={aluno.status} />}
        />
        <StatTile
          label="Em aberto"
          value={formatBRL(resumo.emAberto + resumo.vencido)}
          accentClassName={resumo.vencido > 0 ? "text-danger" : undefined}
          hint={`${resumo.vencidas} vencida(s)`}
        />
        <StatTile label="XP" value={aluno.xp} hint={posicao ? `#${posicao} no ranking` : "sem ranking"} />
        <StatTile label="Ofensiva" value={aluno.streak} accentClassName="text-primary" hint="dias" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Cadastro">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info icon={<IdCard size={18} />} label="Matrícula" value={aluno.matricula} />
            <Info icon={<Cake size={18} />} label="Nascimento" value={formatDate(aluno.nascimento)} />
            <Info icon={<Mail size={18} />} label="E-mail" value={aluno.email} />
            <Info icon={<Phone size={18} />} label="Telefone" value={aluno.telefone} />
          </div>
        </Card>

        <Card title="Plano e atividade">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info icon={<IdCard size={18} />} label="Plano" value={aluno.plano} />
            <Info
              icon={<CalendarClock size={18} />}
              label="Vencimento"
              value={formatDate(aluno.vencimento)}
            />
            <Info
              icon={<CalendarCheck size={18} />}
              label="Última visita"
              value={formatRelativeDays(aluno.ultima_visita)}
            />
            <Info
              icon={<CalendarCheck size={18} />}
              label="Passagens registradas"
              value={acessos.length}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
