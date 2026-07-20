import { UnderConstruction } from "@/shared/ui/UnderConstruction";

export default function RelatoriosPage() {
  return (
    <UnderConstruction
      title="Relatórios"
      description="Indicadores de negócio: retenção, churn, receita e frequência."
      features={[
        "Retenção e churn por período",
        "Receita, ticket médio e MRR",
        "Frequência e ocupação por horário",
        "Funil de matrículas e conversão",
        "Exportação em CSV e PDF",
        "Comparativo entre unidades",
      ]}
    />
  );
}
