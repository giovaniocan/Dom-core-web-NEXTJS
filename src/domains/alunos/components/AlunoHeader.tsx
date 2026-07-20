import Link from "next/link";
import { ArrowLeft, Mail, Phone, Flame, Zap } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Badge } from "@/shared/ui/Badge";
import type { Aluno } from "../types";

const nf = new Intl.NumberFormat("pt-BR");

export interface AlunoHeaderProps {
  aluno: Aluno;
}

export function AlunoHeader({ aluno }: AlunoHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href="/alunos"
        className="mb-4 inline-flex items-center gap-1.5 font-body text-sm text-text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Voltar para alunos
      </Link>

      <div className="flex flex-col gap-4 rounded-card border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={aluno.nome} src={aluno.foto} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl uppercase tracking-wide text-text-strong">
                {aluno.nome}
              </h1>
              <StatusPill status={aluno.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-sm text-text-muted">
              <Badge tone="primary">{aluno.plano}</Badge>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} /> {aluno.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} /> {aluno.telefone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 sm:pl-4">
          <div className="text-center">
            <p className="flex items-center justify-center gap-1 font-body text-xs uppercase tracking-wide text-text-faint">
              <Zap size={13} /> XP
            </p>
            <p className="font-display text-3xl leading-none tracking-wide text-text-strong">
              {nf.format(aluno.xp)}
            </p>
          </div>
          <div className="text-center">
            <p className="flex items-center justify-center gap-1 font-body text-xs uppercase tracking-wide text-text-faint">
              <Flame size={13} /> Ofensiva
            </p>
            <p className="font-display text-3xl leading-none tracking-wide text-primary">
              {aluno.streak}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
