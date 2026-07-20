/** Tipos do domínio Configurações (academia, unidades, usuários, planos e integrações). */

/** Plano SaaS contratado pela academia (nível da conta DomCore). */
export type PlanoSaas = "starter" | "pro" | "enterprise";

/** Papel interno de um usuário do sistema. */
export type PapelUsuario =
  | "dono"
  | "gerente"
  | "recepcao"
  | "personal"
  | "nutricionista";

/** Estado de conexão de uma integração externa. */
export type IntegracaoStatus = "conectado" | "pendente";

/** Academia — espelha o objeto singular `academia` do db.json. */
export interface Academia {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  cnpj: string;
  plano_saas: PlanoSaas;
}

/** Unidade física da academia — espelha a coleção `unidades` do db.json. */
export interface Unidade {
  id: string;
  academiaId: string;
  nome: string;
  endereco: string;
  capacidade: number;
  catracas: number;
}

/** Usuário interno — espelha a coleção `usuarios` do db.json. */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  unidadeId: string;
  ativo: boolean;
}

/** Plano comercial — espelha a coleção `planos` do db.json. */
export interface Plano {
  id: string;
  nome: string;
  valor: number;
  periodo_meses: number;
  descricao: string;
}

/** Integração externa (gateway, catraca, push). Lista estática desta demo. */
export interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  status: IntegracaoStatus;
}

/** Payload da tela /configuracoes. */
export interface ConfiguracoesData {
  academia: Academia;
  unidades: Unidade[];
  usuarios: Usuario[];
  planos: Plano[];
  integracoes: Integracao[];
}
