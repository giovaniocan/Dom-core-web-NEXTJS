/**
 * Cliente HTTP tipado para o json-server (mock).
 * Base configurável via NEXT_PUBLIC_API_URL (default http://localhost:3001).
 */

export type QueryValue = string | number | boolean | undefined | null;
export type Query = Record<string, QueryValue>;

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

function buildUrl(resource: string, query?: Query): string {
  const path = `${BASE_URL}/${resource}`;
  if (!query) return path;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Falha na requisição a ${url} — ${res.status} ${res.statusText ?? ""}`.trim(),
    );
  }

  return (await res.json()) as T;
}

export const apiClient = {
  /** Lista uma coleção do db.json com filtros/paginação opcionais. */
  getList<T>(resource: string, query?: Query): Promise<T[]> {
    return request<T[]>(buildUrl(resource, query));
  },

  /** Busca um único recurso pelo id. */
  getOne<T>(resource: string, id: string | number): Promise<T> {
    return request<T>(buildUrl(`${resource}/${id}`));
  },
};

export const API_BASE_URL = BASE_URL;
