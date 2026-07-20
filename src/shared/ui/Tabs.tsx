"use client";

import { cn } from "@/shared/lib/cn";

export interface TabItem {
  key: string;
  label: string;
  href?: string;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange?: (key: string) => void;
}

/**
 * Abas controladas. Se `onChange` for fornecido, comportam-se como botões;
 * caso contrário renderizam links (`href`) para navegação por rota.
 */
export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <nav className="flex gap-1 border-b border-border">
      {items.map((item) => {
        const active = item.key === activeKey;
        const classes = cn(
          "relative px-4 py-2 font-body text-sm font-semibold transition-colors",
          active ? "text-primary" : "text-text-muted hover:text-text-strong",
        );
        const underline = active && (
          <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
        );

        if (onChange) {
          return (
            <button key={item.key} className={classes} onClick={() => onChange(item.key)}>
              {item.label}
              {underline}
            </button>
          );
        }

        return (
          <a key={item.key} href={item.href} className={classes}>
            {item.label}
            {underline}
          </a>
        );
      })}
    </nav>
  );
}
