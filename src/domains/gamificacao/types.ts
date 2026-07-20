/** Tipos do domínio Gamificação (ranking, recompensas, conquistas e regras de XP). */

export type RecompensaCategoria = "produto" | "beneficio" | "servico";

/** Linha do ranking — espelha a coleção `ranking` do db.json. */
export interface RankingEntry {
  id: string;
  posicao: number;
  alunoId: string;
  nome: string;
  xp: number;
  streak: number;
}

/** Recompensa resgatável — espelha a coleção `recompensas` do db.json. */
export interface Recompensa {
  id: string;
  nome: string;
  custo_xp: number;
  estoque: number;
  /** "produto" | "beneficio" | "servico" (mantido como string por robustez). */
  categoria: string;
}

/** Conquista / badge — espelha a coleção `conquistas` do db.json. */
export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  /** Nome do ícone lucide-react (ex.: "Dumbbell"), resolvido por um lookup local. */
  icone: string;
  criterio: string;
}

/** Configuração das regras de gamificação — objeto singleton `gamificacao_config`. */
export interface GamificacaoConfig {
  id: string;
  xpPorTreino: number;
  foguinhosPorTreino: number;
  bonusStreak: number;
  marcos: number[];
  catalogoResgatavel: boolean;
}

/** Payload da tela /gamificacao (as quatro coleções carregadas em paralelo). */
export interface GamificacaoData {
  ranking: RankingEntry[];
  recompensas: Recompensa[];
  conquistas: Conquista[];
  config: GamificacaoConfig;
}
