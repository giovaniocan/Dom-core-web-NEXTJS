import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { DataTable, type Column } from "../DataTable";

type Row = { id: string; nome: string; idade: number };

const rows: Row[] = [
  { id: "1", nome: "Ana", idade: 28 },
  { id: "2", nome: "Bruno", idade: 34 },
];

const columns: Column<Row>[] = [
  { key: "nome", header: "Nome" },
  { key: "idade", header: "Idade", render: (r) => `${r.idade} anos` },
];

describe("DataTable", () => {
  test("renderiza cabeçalhos das colunas", () => {
    render(<DataTable columns={columns} data={rows} rowKey={(r) => r.id} />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Idade")).toBeInTheDocument();
  });

  test("renderiza uma linha por item", () => {
    render(<DataTable columns={columns} data={rows} rowKey={(r) => r.id} />);
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Bruno")).toBeInTheDocument();
  });

  test("usa a função render custom da coluna", () => {
    render(<DataTable columns={columns} data={rows} rowKey={(r) => r.id} />);
    expect(screen.getByText("28 anos")).toBeInTheDocument();
  });

  test("mostra o estado vazio quando não há dados", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        rowKey={(r) => r.id}
        emptyLabel="Nada por aqui"
      />,
    );
    expect(screen.getByText("Nada por aqui")).toBeInTheDocument();
  });

  test("dispara onRowClick com a linha clicada", async () => {
    const onRowClick = vi.fn();
    render(
      <DataTable columns={columns} data={rows} rowKey={(r) => r.id} onRowClick={onRowClick} />,
    );
    await userEvent.click(screen.getByText("Bruno"));
    expect(onRowClick).toHaveBeenCalledWith(rows[1]);
  });
});
