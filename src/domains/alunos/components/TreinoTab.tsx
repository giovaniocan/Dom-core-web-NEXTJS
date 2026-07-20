import { Dumbbell } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import type { Exercicio, Ficha, FichaItem } from "../types";

interface LinhaFicha extends FichaItem {
  nome: string;
  grupo: string;
  equipamento: string;
}

function buildColumns(): Column<LinhaFicha>[] {
  return [
    {
      key: "nome",
      header: "Exercício",
      render: (i) => (
        <div>
          <p className="font-body font-semibold text-text-strong">{i.nome}</p>
          <p className="font-body text-xs text-text-faint">{i.equipamento}</p>
        </div>
      ),
    },
    { key: "grupo", header: "Grupo", render: (i) => <Badge tone="neutral">{i.grupo}</Badge> },
    {
      key: "series",
      header: "Séries",
      align: "center",
      render: (i) => <span className="font-display text-base tracking-wide">{i.series}</span>,
    },
    {
      key: "reps",
      header: "Reps",
      align: "center",
      render: (i) => <span className="font-display text-base tracking-wide">{i.reps}</span>,
    },
    {
      key: "carga_kg",
      header: "Carga",
      align: "right",
      render: (i) => (
        <span className="font-display text-base tracking-wide">
          {i.carga_kg > 0 ? `${i.carga_kg} kg` : "livre"}
        </span>
      ),
    },
  ];
}

export interface TreinoTabProps {
  fichas: Ficha[];
  exercicios: Exercicio[];
}

export function TreinoTab({ fichas, exercicios }: TreinoTabProps) {
  const byId = new Map(exercicios.map((e) => [e.id, e]));
  const columns = buildColumns();

  if (fichas.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Dumbbell size={40} strokeWidth={1.5} />}
          title="Sem ficha de treino"
          description="Este aluno ainda não possui ficha de treino cadastrada."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {fichas.map((ficha) => {
        const linhas: LinhaFicha[] = ficha.itens.map((item) => {
          const ex = byId.get(item.exercicioId);
          return {
            ...item,
            nome: ex?.nome ?? item.exercicioId,
            grupo: ex?.grupo ?? "—",
            equipamento: ex?.equipamento ?? "—",
          };
        });

        return (
          <Card
            key={ficha.id}
            title={ficha.nome}
            action={<Badge tone="primary">{ficha.objetivo}</Badge>}
            flush
          >
            <div className="border-b border-border px-5 py-2.5">
              <p className="font-body text-xs text-text-muted">
                Prescrita por <span className="text-text-strong">{ficha.professor}</span>
              </p>
            </div>
            <DataTable
              columns={columns}
              data={linhas}
              rowKey={(l) => `${ficha.id}-${l.exercicioId}`}
              emptyLabel="Ficha sem exercícios."
            />
          </Card>
        );
      })}
    </div>
  );
}
