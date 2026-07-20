import { SidebarNav } from "./SidebarNav";

/** Sidebar fixa (desktop ≥ lg). No mobile a navegação vem do MobileNav (drawer). */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-nav lg:flex">
      <SidebarNav />
    </aside>
  );
}
