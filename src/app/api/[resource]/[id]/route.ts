import { NextResponse } from "next/server";
import { getResource } from "@/server/db";

// GET /api/<colecao>/<id> — equivalente ao json-server (busca por id).
export const dynamic = "force-dynamic";

export function GET(
  _req: Request,
  { params }: { params: { resource: string; id: string } },
) {
  const value = getResource(params.resource);

  if (!Array.isArray(value)) {
    return NextResponse.json(
      { error: `Recurso '${params.resource}' não é uma coleção` },
      { status: 404 },
    );
  }

  const item = (value as Record<string, unknown>[]).find(
    (row) => String(row.id ?? "") === params.id,
  );

  if (!item) {
    return NextResponse.json(
      { error: `id '${params.id}' não encontrado em '${params.resource}'` },
      { status: 404 },
    );
  }

  return NextResponse.json(item);
}
