"use client";

import type { ReactNode } from "react";
import { CalendarDays, Clock, MapPin, UserCog } from "lucide-react";
import { Modal } from "@/shared/ui/Modal";
import { Avatar } from "@/shared/ui/Avatar";
import { StatusPill } from "@/shared/ui/StatusPill";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { EmptyState } from "@/shared/ui/EmptyState";
import { cn } from "@/shared/lib/cn";
import {
  buildRoster,
  modalidadeAccent,
  ocupacaoPct,
  ocupacaoTone,
  vagasRestantes,
} from "../services/agenda-service";
import type { AlunoLite, Aula } from "../types";

interface ClassDetailModalProps {
  aula: Aula | null;
  alunos: AlunoLite[];
  unidadeNome?: string;
  onClose: () => void;
}

/** Detalhe de uma turma: metadados + roster de inscritos com presença. */
export function ClassDetailModal({ aula, alunos, unidadeNome, onClose }: ClassDetailModalProps) {
  const open = aula !== null;
  if (!aula) return <Modal open={false} onClose={onClose}>{null}</Modal>;

  const accent = modalidadeAccent(aula.nome);
  const pct = ocupacaoPct(aula);
  const roster = buildRoster(aula, alunos);
  const presentes = roster.filter((r) => r.presente).length;

  return (
    <Modal open={open} onClose={onClose} title={aula.nome} className="max-w-xl">
      <div className="space-y-5">
        {/* Metadados */}
        <div className="grid grid-cols-2 gap-3 font-body text-sm text-text-muted">
          <MetaRow icon={<UserCog size={15} className={accent.text} />} label={aula.professor} />
          <MetaRow icon={<CalendarDays size={15} className={accent.text} />} label={aula.dia} />
          <MetaRow icon={<Clock size={15} className={accent.text} />} label={aula.hora} />
          {unidadeNome && (
            <MetaRow icon={<MapPin size={15} className={accent.text} />} label={unidadeNome} />
          )}
        </div>

        {/* Ocupação */}
        <div className={cn("rounded-lg p-3.5", accent.soft)}>
          <div className="mb-2 flex items-end justify-between">
            <div>
              <span className="font-display text-3xl leading-none tracking-wide text-text-strong">
                {aula.inscritos}
              </span>
              <span className="font-body text-sm text-text-muted"> / {aula.vagas} vagas</span>
            </div>
            <span className="font-body text-sm font-semibold text-text-muted">
              {vagasRestantes(aula)} livres
            </span>
          </div>
          <ProgressBar value={pct} tone={ocupacaoTone(pct)} showLabel />
        </div>

        {/* Roster / presença */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-body text-sm font-semibold text-text-strong">Inscritos</h4>
            <span className="font-body text-xs text-text-muted">
              <span className="font-display text-sm text-success">{presentes}</span> presentes de{" "}
              <span className="font-display text-sm text-text-strong">{roster.length}</span>
            </span>
          </div>

          {roster.length === 0 ? (
            <EmptyState title="Sem inscritos" description="Ainda não há alunos nesta turma." />
          ) : (
            <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {roster.map((entry) => (
                <li
                  key={entry.alunoId}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                >
                  <Avatar name={entry.nome} src={entry.foto} size="sm" />
                  <span className="flex-1 truncate font-body text-sm text-text-strong">
                    {entry.nome}
                  </span>
                  <StatusPill status={entry.presente ? "presente" : "ausente"} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

function MetaRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2">
      {icon}
      <span className="truncate text-text-strong">{label}</span>
    </span>
  );
}
