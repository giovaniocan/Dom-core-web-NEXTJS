import { UnderConstruction } from "@/shared/ui/UnderConstruction";

export default function GamificacaoPage() {
  return (
    <UnderConstruction
      title="Gamificação"
      description="XP, foguinhos, streaks, ligas e recompensas — o diferencial do DomCore."
      features={[
        "Regras de XP por check-in, treino e meta batida",
        "Streaks (foguinhos) e proteção de sequência",
        "Ligas e temporadas com ranking por unidade",
        "Catálogo de recompensas e resgates",
        "Missões e desafios semanais",
        "Configuração de multiplicadores e eventos",
      ]}
    />
  );
}
