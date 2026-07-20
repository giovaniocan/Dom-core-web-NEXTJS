import { AlunoDetalheView } from "@/domains/alunos/components/AlunoDetalheView";

/** Rota fina: repassa o id da rota para a ficha 360 do domínio Alunos. */
export default function AlunoDetalhePage({ params }: { params: { id: string } }) {
  return <AlunoDetalheView id={params.id} />;
}
