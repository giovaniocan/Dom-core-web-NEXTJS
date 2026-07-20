# DomCore Web — Demonstração

Front-end de **demonstração** do DomCore Web (gestão de academia) para o cliente **DomCore Gym - PR**.
Arquitetura **separada por domínio**, com **TDD** (Vitest) e dados mockados via **json-server**.

Estética "gym + game": paleta laranja DomCore, tipografia Bebas Neue (números/títulos) + Barlow (corpo),
temas claro (default) e escuro.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (`darkMode: "class"`, tokens DomCore via CSS variables)
- **lucide-react** (ícones) + **clsx**
- **Vitest** + **@testing-library/react** + **jsdom** (testes)
- **json-server** servindo `db.json` na porta **3001**

## Como rodar

```bash
npm install          # instala dependências
npm run dev:all      # sobe json-server (3001) + Next.js (3000) juntos
```

Depois abra http://localhost:3000. A API mock fica em http://localhost:3001
(configurável por `NEXT_PUBLIC_API_URL` em `.env.local`).

> Para rodar separado: `npm run mock` (API) e `npm run dev` (front) em terminais distintos.

## Testes

```bash
npm test             # roda toda a suíte (vitest run)
npm run test:watch   # modo watch
```

Cobrimos por TDD: `api-client`, `format`, UI kit (`Button`, `DataTable`, `StatusPill`, `StatTile`)
e o domínio de referência `dashboard` (service + componente `KpiRow`).

## Arquitetura

```
src/
  app/(app)/            # rotas Next FINAS: cada page.tsx só renderiza o domínio
  domains/<dominio>/     # components, hooks, services, types.ts, __tests__ co-localizados
  shared/
    ui/                  # UI kit (Button, Card, StatTile, DataTable, Badge, StatusPill, ...)
    layout/              # Sidebar, Topbar, AppShell, ThemeToggle, ThemeProvider
    lib/                 # api-client, cn, format
    config/              # nav.ts (menu com status pronto | em-construcao)
  test/                  # setup.ts + utils.tsx (render com providers)
db.json                  # dados mockados (DomCore Gym - PR)
```

O domínio **`dashboard`** é a **referência** de padrão (service testado + hook + componentes finos +
page fina em `app/(app)/page.tsx`). Novos domínios (alunos, financeiro, catraca, agenda) seguem a
mesma estrutura — ver **`CONTRATO-DOMINIOS.md`** para as assinaturas exatas do UI kit, api-client,
layout, padrão TDD e tipos compartilhados.

## Módulos

| Módulo | Status | Rotas |
|---|---|---|
| Dashboard | pronto | `/` |
| Alunos | pronto (slot p/ domínio) | `/alunos`, `/alunos/[id]` |
| Financeiro | pronto (slot p/ domínio) | `/financeiro`, `/financeiro/inadimplencia` |
| Catraca | pronto (slot p/ domínio) | `/catraca`, `/catraca/frequencia` |
| Agenda | pronto (slot p/ domínio) | `/agenda` |
| Treinos, Dieta, Profissionais, Gamificação, Relatórios, Configurações | em construção | placeholders visíveis no menu |
