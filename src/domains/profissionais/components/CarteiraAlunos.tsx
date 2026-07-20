"use client";

import { Users } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Modal } from "@/shared/ui/Modal";
import { StatusPill } from "@/shared/ui/StatusPill";
import type { AlunoResumo, Profissional } from "../types";

export interface CarteiraAlunosProps {
  /** Profissional selecionado; `null` mantém o modal fechado. */
  profissional: Profissional | null;
  /** Alunos já derivados das fichas do profissional. */
  alunos: AlunoResumo[];
  onClose: () => void;
}

/** Modal com a carteira de alunos de um profissional (EmptyState quando vazia). */
export function CarteiraAlunos({ profissional, alunos, onClose }: CarteiraAlunosProps) {
  return (
    <Modal
      open={profissional !== null}
      onClose={onClose}
      title={profissional ? `Carteira · ${profissional.nome}` : "Carteira"}
    >
      {profissional &&
        (alunos.length === 0 ? (
          <EmptyState
            icon={<Users size={40} strokeWidth={1.5} />}
            title="Nenhum aluno na carteira"
            description={`${profissional.nome} ainda não tem alunos com ficha atribuída nesta demo.`}
          />
        ) : (
          <div className="space-y-3">
            <p className="font-body text-xs text-text-faint">
              {alunos.length} {alunos.length === 1 ? "aluno" : "alunos"} com ficha atribuída
            </p>
            <ul className="space-y-2">
              {alunos.map((aluno) => (
                <li
                  key={aluno.id}
                  className="flex items-center gap-3 rounded-card border border-border bg-card-alt/50 p-3"
                >
                  <Avatar name={aluno.nome} src={aluno.foto || undefined} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-semibold text-text-strong">
                      {aluno.nome}
                    </p>
                    <p className="font-body text-xs text-text-faint">Plano {aluno.plano}</p>
                  </div>
                  <StatusPill status={aluno.status} />
                </li>
              ))}
            </ul>
          </div>
        ))}
    </Modal>
  );
}
