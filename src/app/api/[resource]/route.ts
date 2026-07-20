import { NextRequest, NextResponse } from "next/server";
import { getResource } from "@/server/db";

// Serverless (Vercel): lê o db.json e responde como o json-server faria no GET.
export const dynamic = "force-dynamic";

export function GET(
  req: NextRequest,
  { params }: { params: { resource: string } },
) {
  const value = getResource(params.resource);

  if (value === undefined) {
    return NextResponse.json(
      { error: `Coleção '${params.resource}' não encontrada` },
      { status: 404 },
    );
  }

  // Recurso-objeto (ex.: academia, dashboard) — devolve como está.
  if (!Array.isArray(value)) {
    return NextResponse.json(value);
  }

  let rows = value as Record<string, unknown>[];
  const sp = req.nextUrl.searchParams;

  // Filtros de igualdade (?campo=valor) — compatível com o json-server.
  for (const [key, val] of Array.from(sp.entries())) {
    if (key.startsWith("_") || key === "q") continue;
    rows = rows.filter((row) => String(row[key] ?? "") === val);
  }

  // Busca textual (?q=)
  const q = sp.get("q");
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(needle),
    );
  }

  // Ordenação (?_sort=campo&_order=asc|desc)
  const sort = sp.get("_sort");
  if (sort) {
    const dir = sp.get("_order")?.toLowerCase() === "desc" ? -1 : 1;
    rows = [...rows].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (av === bv) return 0;
      return ((av as number) > (bv as number) ? 1 : -1) * dir;
    });
  }

  // Paginação (?_page=&_limit= ou só ?_limit=)
  const limit = sp.get("_limit");
  const page = sp.get("_page");
  if (page && limit) {
    const p = Math.max(1, Number(page));
    const l = Number(limit);
    rows = rows.slice((p - 1) * l, (p - 1) * l + l);
  } else if (limit) {
    rows = rows.slice(0, Number(limit));
  }

  return NextResponse.json(rows);
}
