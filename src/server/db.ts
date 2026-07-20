/**
 * Fonte de dados do mock para os Route Handlers (deploy no Vercel).
 *
 * Em desenvolvimento, o app consome o json-server (porta 3001).
 * Em produção (Vercel, serverless, filesystem read-only), o json-server não
 * roda — então os Route Handlers em `app/api/*` leem este mesmo `db.json`
 * (que vai no bundle) e replicam o comportamento GET do json-server.
 */
import database from "../../db.json";

type Db = Record<string, unknown>;

const db = database as unknown as Db;

/** Retorna o valor bruto de uma coleção (array) ou recurso-objeto do db.json. */
export function getResource(name: string): unknown {
  return db[name];
}
