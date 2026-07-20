import { apiClient } from "@/shared/lib/api-client";
import type {
  Academia,
  ConfiguracoesData,
  Integracao,
  Plano,
  Unidade,
  Usuario,
} from "../types";

/**
 * Integrações externas da academia. Modeladas como lista estática desta demo
 * (read-only) — em produção viriam de uma coleção/serviço de integrações.
 */
export const INTEGRACOES: ReadonlyArray<Integracao> = [
  {
    id: "int-asaas",
    nome: "Gateway de pagamento (Asaas)",
    descricao: "Cobrança recorrente, Pix e boleto dos planos.",
    status: "conectado",
  },
  {
    id: "int-catraca",
    nome: "Catraca facial",
    descricao: "Liberação de acesso por reconhecimento facial.",
    status: "conectado",
  },
  {
    id: "int-push",
    nome: "Push do app do aluno",
    descricao: "Notificações de vencimento, aulas e recompensas.",
    status: "pendente",
  },
];

/** Conta quantos usuários estão ativos. */
export function usuariosAtivos(usuarios: Usuario[]): number {
  return usuarios.reduce((total, u) => (u.ativo ? total + 1 : total), 0);
}

/** Resolve o nome de uma unidade pelo id (traço quando não encontrada). */
export function nomeUnidade(id: string, unidades: Unidade[]): string {
  return unidades.find((u) => u.id === id)?.nome ?? "—";
}

/**
 * Carrega os dados da tela /configuracoes em paralelo.
 * `academia` é um recurso singular no json-server: `GET /academia` devolve o
 * objeto diretamente (não um array), por isso o cast controlado abaixo.
 */
export async function getConfiguracoesData(): Promise<ConfiguracoesData> {
  const [academiaRaw, unidades, usuarios, planos] = await Promise.all([
    apiClient.getList<Academia>("academia"),
    apiClient.getList<Unidade>("unidades"),
    apiClient.getList<Usuario>("usuarios"),
    apiClient.getList<Plano>("planos"),
  ]);

  const academia = academiaRaw as unknown as Academia;

  return {
    academia,
    unidades,
    usuarios,
    planos,
    integracoes: [...INTEGRACOES],
  };
}
