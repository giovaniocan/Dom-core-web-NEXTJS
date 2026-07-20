import { UnderConstruction } from "@/shared/ui/UnderConstruction";

export default function TreinosPage() {
  return (
    <UnderConstruction
      title="Treinos"
      description="Montagem de fichas, biblioteca de exercícios e prescrição por objetivo."
      features={[
        "Biblioteca de exercícios com vídeo e grupo muscular",
        "Montagem de fichas por objetivo (hipertrofia, resistência)",
        "Prescrição de séries, repetições e carga",
        "Progressão automática e histórico de cargas",
        "Vínculo aluno ↔ personal responsável",
        "Publicação da ficha no app do aluno",
      ]}
    />
  );
}
