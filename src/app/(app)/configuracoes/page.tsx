import { UnderConstruction } from "@/shared/ui/UnderConstruction";

export default function ConfiguracoesPage() {
  return (
    <UnderConstruction
      title="Configurações"
      description="Academia, unidades, planos, integrações e preferências do sistema."
      features={[
        "Dados da academia e unidades",
        "Planos, preços e regras de cobrança",
        "Integrações (gateway de pagamento, catraca, push)",
        "Usuários internos e permissões",
        "Personalização de marca e tema",
        "Auditoria e logs de acesso",
      ]}
    />
  );
}
