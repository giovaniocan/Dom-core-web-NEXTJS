import { Tabs, type TabItem } from "@/shared/ui/Tabs";

const ITEMS: TabItem[] = [
  { key: "ao-vivo", label: "Ao vivo", href: "/catraca" },
  { key: "frequencia", label: "Frequência", href: "/catraca/frequencia" },
];

/** Abas de navegação entre o painel ao vivo e a frequência (links por rota). */
export function CatracaTabs({ active }: { active: "ao-vivo" | "frequencia" }) {
  return <Tabs items={ITEMS} activeKey={active} />;
}
