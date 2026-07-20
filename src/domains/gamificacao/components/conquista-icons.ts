import {
  Award,
  CalendarCheck,
  Crown,
  Dumbbell,
  Flame,
  Salad,
  Star,
  Sunrise,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/**
 * Lookup local e estático de ícones lucide por nome (string vinda do db.json).
 * Objeto simples — sem `require` dinâmico — para o bundler resolver em build.
 */
const CONQUISTA_ICONS: Record<string, LucideIcon> = {
  Dumbbell,
  Flame,
  CalendarCheck,
  Trophy,
  Star,
  Crown,
  Sunrise,
  Salad,
  Award,
};

/** Ícone padrão para nomes desconhecidos. */
export const FALLBACK_CONQUISTA_ICON: LucideIcon = Award;

/** Resolve o componente de ícone lucide pelo nome; usa `Award` como fallback. */
export function resolveConquistaIcon(name: string): LucideIcon {
  return CONQUISTA_ICONS[name] ?? FALLBACK_CONQUISTA_ICON;
}
