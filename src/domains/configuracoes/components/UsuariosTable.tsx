import { Badge, type BadgeTone } from "@/shared/ui/Badge";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { StatusPill } from "@/shared/ui/StatusPill";
import { nomeUnidade } from "../services/configuracoes-service";
import type { PapelUsuario, Unidade, Usuario } from "../types";

const PAPEL_META: Record<PapelUsuario, { label: string; tone: BadgeTone }> = {
  dono: { label: "Dono", tone: "primary" },
  gerente: { label: "Gerente", tone: "info" },
  recepcao: { label: "Recepção", tone: "neutral" },
  personal: { label: "Personal", tone: "success" },
  nutricionista: { label: "Nutricionista", tone: "warning" },
};

export interface UsuariosTableProps {
  usuarios: Usuario[];
  unidades: Unidade[];
}

/** Tabela de usuários internos: papel, unidade resolvida e status de acesso. */
export function UsuariosTable({ usuarios, unidades }: UsuariosTableProps) {
  const columns: Column<Usuario>[] = [
    {
      key: "nome",
      header: "Usuário",
      render: (u) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text-strong">{u.nome}</span>
          <span className="text-xs text-text-faint">{u.email}</span>
        </div>
      ),
    },
    {
      key: "papel",
      header: "Papel",
      render: (u) => {
        const meta = PAPEL_META[u.papel];
        return <Badge tone={meta?.tone ?? "neutral"}>{meta?.label ?? u.papel}</Badge>;
      },
    },
    {
      key: "unidadeId",
      header: "Unidade",
      render: (u) => (
        <span className="font-body text-sm text-text-muted">
          {nomeUnidade(u.unidadeId, unidades)}
        </span>
      ),
    },
    {
      key: "ativo",
      header: "Status",
      align: "center",
      render: (u) => (
        <StatusPill
          status={u.ativo ? "ativo" : "inativo"}
          label={u.ativo ? "Ativo" : "Inativo"}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={usuarios}
      rowKey={(u) => u.id}
      emptyLabel="Nenhum usuário cadastrado."
    />
  );
}
