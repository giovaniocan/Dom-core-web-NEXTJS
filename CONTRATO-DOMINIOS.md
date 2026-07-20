# CONTRATO — Fundação DomCore Web (para agentes de domínio)

Este documento é a **fonte de verdade** para implementar novos domínios (alunos, financeiro,
catraca, agenda, etc.) sobre a fundação já pronta. Siga-o à risca — imports, props e assinaturas
abaixo são exatos.

Base: Next.js 14 App Router · TypeScript · Tailwind (`darkMode: "class"`) · alias `@/* → src/*`.

---

## (a) UI kit — `@/shared/ui`

Importe de `@/shared/ui` (barrel) ou do arquivo direto. Props exatas:

### `Button` — `@/shared/ui/Button`
```ts
variant?: "primary" | "secondary" | "ghost" | "danger"   // default "primary"
size?: "sm" | "md" | "lg"                                  // default "md"
leftIcon?: ReactNode
fullWidth?: boolean
// + todos os atributos nativos de <button> (onClick, disabled, type...)
```

### `Card` — `@/shared/ui/Card`
```ts
title?: ReactNode      // header opcional
action?: ReactNode     // alinhado à direita do título
flush?: boolean        // remove padding interno (para tabelas full-bleed)
// + atributos nativos de <div>. children = corpo.
```

### `StatTile` — `@/shared/ui/StatTile`
```ts
label: string
value: ReactNode
hint?: string
icon?: ReactNode
delta?: { value: string; trend: "up" | "down" | "flat" }
accentClassName?: string   // ex: "text-danger" para colorir o valor
```

### `DataTable<T>` — `@/shared/ui/DataTable`
```ts
type Column<T> = {
  key: string
  header: ReactNode
  render?: (row: T) => ReactNode      // default: String(row[key])
  className?: string
  align?: "left" | "center" | "right"
}
props: {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string          // OBRIGATÓRIO
  onRowClick?: (row: T) => void
  emptyLabel?: string                 // default "Nenhum registro encontrado."
  className?: string
}
```

### `Badge` — `@/shared/ui/Badge`
```ts
tone?: "neutral" | "primary" | "success" | "danger" | "warning" | "info"   // default "neutral"
children: ReactNode
```

### `StatusPill` — `@/shared/ui/StatusPill`
```ts
status: string   // conhece: ativo, inadimplente, trancado, cancelado, paga, aberta,
                 //          vencida, liberado, negado, pendente, concluido
label?: string   // sobrescreve o rótulo do mapa
```
> Fallback: status desconhecido é exibido literalmente com tom neutro. **Amplie o mapa em
> `StatusPill.tsx`** se seu domínio tiver novos status.

### `PageHeader` — `@/shared/ui/PageHeader`
```ts
title: string
subtitle?: string
actions?: ReactNode   // botões/filtros à direita
children?: ReactNode  // abaixo do título (ex: <Tabs/>)
```

### `Tabs` — `@/shared/ui/Tabs`
```ts
items: { key: string; label: string; href?: string }[]
activeKey: string
onChange?: (key: string) => void   // se ausente, usa items[].href como link (navegação por rota)
```

### `Modal` — `@/shared/ui/Modal`
```ts
open: boolean
onClose: () => void        // ESC e clique no backdrop também fecham
title?: ReactNode
footer?: ReactNode
children: ReactNode
```

### `Avatar` — `@/shared/ui/Avatar`
```ts
name: string               // gera iniciais quando não há src
src?: string
size?: "sm" | "md" | "lg"  // default "md"
```

### `EmptyState` — `@/shared/ui/EmptyState`
```ts
title: string
description?: string
icon?: ReactNode           // default <Inbox/>
action?: ReactNode
```

### `ProgressBar` — `@/shared/ui/ProgressBar`
```ts
value: number              // 0–100 (clampeado)
tone?: "primary" | "success" | "danger" | "warning"
showLabel?: boolean
```

### `UnderConstruction` — `@/shared/ui/UnderConstruction`
```ts
title: string
description: string
features: string[]         // 4–6 funcionalidades planejadas
```
> Use **apenas** em módulos com status `em-construcao`.

---

## (b) HTTP — `@/shared/lib/api-client`

```ts
import { apiClient } from "@/shared/lib/api-client";

apiClient.getList<T>(resource: string, query?: Record<string, string|number|boolean|null|undefined>): Promise<T[]>
apiClient.getOne<T>(resource: string, id: string | number): Promise<T>
```

- Base: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- `query` vira querystring (json-server): filtros (`status=vencida`), paginação (`_page`, `_limit`),
  ordenação (`_sort`, `_order`), texto (`q`), relações (`alunoId=al-1`).
- Lança `Error` com status quando `res.ok` é falso. **Trate no hook** (padrão loading/error).

### Coleções em `db.json`
`academia` (objeto) · `unidades` · `usuarios` · `planos` · `alunos` · `contratos` · `faturas` ·
`acessos` · `aulas` · `exercicios` · `fichas` · `recompensas` · `ranking` · `profissionais` ·
`dashboard` (array com 1 snapshot).

Mapa domínio → coleção: **alunos** → `alunos` (detalhe: `getOne("alunos", id)`) ·
**financeiro** → `faturas` (+ `planos`, `contratos`); inadimplência = `getList("faturas", { status: "vencida" })` ·
**catraca** → `acessos` · **agenda** → `aulas`.

---

## (c) Layout — onde a page do domínio se encaixa

- A casca (`AppShell` = `Sidebar` + `Topbar`) já é aplicada por `src/app/(app)/layout.tsx`.
  **Não** recrie shell/sidebar/topbar no domínio.
- O menu vem de `@/shared/config/nav.ts` (`NAV_SECTIONS`). Para tornar um módulo "real",
  mude o `status` do item de `"em-construcao"` para `"pronto"` (remove o selo "em breve").
- **A page do App Router é FINA**: só importa e renderiza o componente-raiz do domínio.

```tsx
// src/app/(app)/<rota>/page.tsx
import { MeuDominioView } from "@/domains/<dominio>/components/MeuDominioView";
export default function Page() {
  return <MeuDominioView />;
}
```

- Tema: use sempre os tokens Tailwind (`bg-card`, `text-text-strong`, `text-text-muted`,
  `border-border`, `bg-primary-btn`, `text-primary`, `text-success/danger/warning`,
  `text-gold/silver/bronze`). Números/títulos: classe `font-display`. Nunca hardcode hex.

---

## (d) Padrão TDD e estrutura de pastas de um domínio

Referência viva: **`src/domains/dashboard/`**. Replique a estrutura:

```
src/domains/<dominio>/
  types.ts                       # tipos do domínio
  services/<dominio>-service.ts  # funções puras + chamadas via apiClient
  hooks/use<Dominio>.ts          # "use client"; loading/error/data; cleanup com flag `active`
  components/
    <Dominio>View.tsx            # "use client"; raiz; orquestra hook + subcomponentes
    <Subcomponente>.tsx          # componentes finos e testáveis
  __tests__/
    <dominio>-service.test.ts    # mocka "@/shared/lib/api-client" (vi.mock)
    <Subcomponente>.test.tsx     # render de "@/test/utils"
```

**Fluxo TDD (obrigatório):** escreva o teste primeiro (RED) → implemente até passar (GREEN) →
refatore. Rode `npm test`.

- **Services**: testar mockando o api-client —
  `vi.mock("@/shared/lib/api-client", () => ({ apiClient: { getList: vi.fn(), getOne: vi.fn() } }))`,
  depois `vi.mocked(apiClient.getList).mockResolvedValue([...])`. Extraia lógica pura (ex:
  `revenueProgress`, `pickPodium`) e teste isoladamente.
- **Componentes**: importe `render`/`screen` de **`@/test/utils`** (já embrulha no `ThemeProvider`).
  Prefira queries por papel/texto. `userEvent` para interações.
- **Setup** já configurado: `vitest.config.ts` (jsdom, alias `@`, `src/test/setup.ts`).

Exemplo mínimo de service test:
```ts
import { vi } from "vitest";
import { apiClient } from "@/shared/lib/api-client";
vi.mock("@/shared/lib/api-client", () => ({ apiClient: { getList: vi.fn(), getOne: vi.fn() } }));
// ... vi.mocked(apiClient.getList).mockResolvedValue([...])
```

---

## (e) Tipos compartilhados

- **Nenhum tipo de entidade global** é exportado hoje — **cada domínio declara seus tipos** em
  `domains/<dominio>/types.ts` (evita acoplamento). Espelhe os campos do `db.json`.
- Reaproveitáveis já exportados:
  - Do api-client: `Query`, `QueryValue`, `API_BASE_URL`.
  - Do UI kit (via `@/shared/ui`): `Column<T>`, `ButtonVariant`, `ButtonSize`, `BadgeTone`,
    `Trend`, `ProgressTone`, `TabItem`, e as `*Props` de cada componente.
  - Do nav: `NavItem`, `NavSection`, `NavStatus` (`@/shared/config/nav`).
  - Tema: `useTheme()`, `Theme` (`@/shared/layout/ThemeProvider`).

### Shape das principais coleções (campos do db.json)
```ts
// alunos
{ id, academiaId, unidadeId, nome, genero, email, telefone, foto, status,
  planoId, plano, matricula, vencimento, ultima_visita, xp, streak, nascimento }
  // status: "ativo" | "inadimplente" | "trancado"

// faturas
{ id, alunoId, aluno, contratoId, competencia, vencimento, valor, status,
  meio, pago_em, tentativas_cobranca, ultima_tentativa }
  // status: "paga" | "aberta" | "vencida" ; meio: "pix" | "cartao" | "boleto"

// acessos (catraca)
{ id, alunoId, aluno, foto, unidadeId, terminal, sentido, resultado, motivo, timestamp }
  // sentido: "entrada" | "saida" ; resultado: "liberado" | "negado"

// aulas
{ id, nome, professor, unidadeId, dia, hora, vagas, inscritos }

// planos       { id, nome, valor, periodo_meses, descricao }
// contratos    { id, alunoId, planoId, inicio, fim, status, valor_mensal }
// profissionais{ id, nome, papel, cref, unidadeId, alunos_ativos, foto }
```

> Coerência garantida: todo aluno `inadimplente` possui ≥1 fatura `vencida`.

### Formatação — `@/shared/lib/format`
```ts
formatBRL(value: number | null | undefined): string   // "R$ 1.500,00" | "—"
formatDate(value): string                              // "20/07/2026" | "—"
formatDateTime(value): string                          // "20/07/2026 08:30" | "—"
formatRelativeDays(value): string                      // "hoje" | "há 1 dia" | "há N dias"
```
E `cn(...classes)` de `@/shared/lib/cn` para compor classes condicionais.
