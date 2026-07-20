import { UnderConstruction } from "@/shared/ui/UnderConstruction";

export default function ProfissionaisPage() {
  return (
    <UnderConstruction
      title="Profissionais"
      description="Equipe da academia: personais, nutricionistas, recepção e permissões."
      features={[
        "Cadastro de personais, nutricionistas e recepção",
        "Papéis e permissões (RBAC) por função",
        "Agenda e disponibilidade de cada profissional",
        "Carteira de alunos por personal",
        "Comissões e metas por profissional",
        "Indicadores de desempenho da equipe",
      ]}
    />
  );
}
