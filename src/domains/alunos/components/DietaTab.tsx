import { Salad } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import type { Aluno } from "../types";

export interface DietaTabProps {
  aluno: Aluno;
}

export function DietaTab({ aluno }: DietaTabProps) {
  return (
    <Card>
      <EmptyState
        icon={<Salad size={40} strokeWidth={1.5} />}
        title="Plano alimentar não cadastrado"
        description={`${aluno.nome.split(" ")[0]} ainda não tem um plano alimentar. O módulo de Dieta integrará prescrições e metas nutricionais em breve.`}
      />
    </Card>
  );
}
