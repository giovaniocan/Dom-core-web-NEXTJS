import { UnderConstruction } from "@/shared/ui/UnderConstruction";

export default function DietaPage() {
  return (
    <UnderConstruction
      title="Dieta"
      description="Planos alimentares, metas de macros e acompanhamento nutricional."
      features={[
        "Planos alimentares por refeição e horário",
        "Metas de macronutrientes e calorias",
        "Biblioteca de alimentos e substituições",
        "Check-in de refeições no app do aluno",
        "Acompanhamento de peso e composição corporal",
        "Vínculo com nutricionista responsável",
      ]}
    />
  );
}
