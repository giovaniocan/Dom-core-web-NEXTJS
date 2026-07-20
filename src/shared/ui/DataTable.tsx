import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface Column<T> {
  /** Chave da coluna (usada como key e fallback de acesso a T). */
  key: string;
  header: ReactNode;
  /** Render custom da célula; default é String(row[key]). */
  render?: (row: T) => ReactNode;
  /** Classe extra aplicada à célula e ao cabeçalho (ex: alinhamento). */
  className?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyLabel?: string;
  className?: string;
}

const ALIGN: Record<NonNullable<Column<unknown>["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyLabel = "Nenhum registro encontrado.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 font-body text-xs font-semibold uppercase tracking-wide text-text-muted",
                  ALIGN[col.align ?? "left"],
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center font-body text-sm text-text-faint"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-border/60 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-card-alt",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 font-body text-text-strong",
                      ALIGN[col.align ?? "left"],
                      col.className,
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
