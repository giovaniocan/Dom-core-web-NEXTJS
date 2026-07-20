import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ScanFace,
  CalendarDays,
  Dumbbell,
  Salad,
  BriefcaseBusiness,
  Trophy,
  BarChart3,
  Settings,
} from "lucide-react";

export type NavStatus = "pronto" | "em-construcao";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  status: NavStatus;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** Menu completo do DomCore Web. Todos os módulos aparecem; status controla o selo. */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Operação",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, status: "pronto" },
      { label: "Alunos", href: "/alunos", icon: Users, status: "pronto" },
      { label: "Financeiro", href: "/financeiro", icon: Wallet, status: "pronto" },
      { label: "Catraca", href: "/catraca", icon: ScanFace, status: "pronto" },
      { label: "Agenda", href: "/agenda", icon: CalendarDays, status: "pronto" },
    ],
  },
  {
    title: "Treino & Engajamento",
    items: [
      { label: "Treinos", href: "/treinos", icon: Dumbbell, status: "pronto" },
      { label: "Dieta", href: "/dieta", icon: Salad, status: "pronto" },
      {
        label: "Profissionais",
        href: "/profissionais",
        icon: BriefcaseBusiness,
        status: "pronto",
      },
      { label: "Gamificação", href: "/gamificacao", icon: Trophy, status: "pronto" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { label: "Relatórios", href: "/relatorios", icon: BarChart3, status: "pronto" },
      { label: "Configurações", href: "/configuracoes", icon: Settings, status: "pronto" },
    ],
  },
];

/** Lista achatada de todos os itens (útil para breadcrumbs / lookup). */
export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
