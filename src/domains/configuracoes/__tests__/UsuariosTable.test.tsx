import { describe, expect, test } from "vitest";
import { render, screen } from "@/test/utils";
import { UsuariosTable } from "../components/UsuariosTable";
import type { Unidade, Usuario } from "../types";

const unidades: Unidade[] = [
  {
    id: "un-1",
    academiaId: "ac-1",
    nome: "Unidade Centro",
    endereco: "R. XV, 1200",
    capacidade: 260,
    catracas: 2,
  },
  {
    id: "un-2",
    academiaId: "ac-1",
    nome: "Unidade Batel",
    endereco: "Av. do Batel, 850",
    capacidade: 180,
    catracas: 1,
  },
];

const usuarios: Usuario[] = [
  {
    id: "u-1",
    nome: "Lucas Garcia",
    email: "lucas@domcore.com.br",
    papel: "dono",
    unidadeId: "un-1",
    ativo: true,
  },
  {
    id: "u-6",
    nome: "Beatriz Lima",
    email: "bia@domcore.com.br",
    papel: "recepcao",
    unidadeId: "un-2",
    ativo: false,
  },
];

describe("UsuariosTable", () => {
  test("exibe o nome e o e-mail de cada usuário", () => {
    render(<UsuariosTable usuarios={usuarios} unidades={unidades} />);
    expect(screen.getByText("Lucas Garcia")).toBeInTheDocument();
    expect(screen.getByText("lucas@domcore.com.br")).toBeInTheDocument();
    expect(screen.getByText("Beatriz Lima")).toBeInTheDocument();
  });

  test("exibe o papel do usuário como Badge legível", () => {
    render(<UsuariosTable usuarios={usuarios} unidades={unidades} />);
    expect(screen.getByText("Dono")).toBeInTheDocument();
    expect(screen.getByText("Recepção")).toBeInTheDocument();
  });

  test("resolve o nome da unidade a partir do unidadeId", () => {
    render(<UsuariosTable usuarios={usuarios} unidades={unidades} />);
    expect(screen.getByText("Unidade Centro")).toBeInTheDocument();
    expect(screen.getByText("Unidade Batel")).toBeInTheDocument();
  });

  test("mostra o status ativo/inativo via StatusPill", () => {
    render(<UsuariosTable usuarios={usuarios} unidades={unidades} />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  test("mostra estado vazio quando não há usuários", () => {
    render(<UsuariosTable usuarios={[]} unidades={unidades} />);
    expect(screen.getByText(/nenhum usuário/i)).toBeInTheDocument();
  });
});
