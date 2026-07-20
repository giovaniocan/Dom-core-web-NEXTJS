# Plano de Desenvolvimento — Módulos Restantes (DomCore Web)

> Objetivo: construir os 6 módulos "EM BREVE" **do mesmo jeito** dos prontos (Dashboard, Alunos, Financeiro, Catraca, Agenda): arquitetura por domínio + TDD (Vitest/RTL) + json-server como API.

## A receita (vale para TODO módulo)

Cada módulo segue exatamente o mesmo padrão de pastas de `src/domains/financeiro/`:

1. **`types.ts`** — tipos do domínio (nada global).
2. **`services/<mod>-service.ts`** — busca dados via `apiClient` (json-server) + funções puras (cálculos/agregações). Testável.
3. **`hooks/use<Mod>.ts`** — `"use client"`, expõe `loading/error/data`.
4. **`components/<Mod>View.tsx`** + subcomponentes — usam **só** o UI kit (`@/shared/ui`).
5. **`__tests__/`** — teste **primeiro** (RED→GREEN): service + hooks + 1–2 componentes.
6. **Rota fina** em `src/app/(app)/<mod>/page.tsx` — só renderiza `<ModView/>`.
7. **Ligar no menu** — mudar `status` do módulo em `src/shared/config/nav.ts` de `em-construcao` → `pronto` (tira o selo "EM BREVE").

Referência viva do padrão: `src/domains/financeiro/` e `CONTRATO-DOMINIOS.md`.

---

## Os 6 módulos

### 1. Treinos  · dados: ✅ prontos (`exercicios`, `fichas`)
- **Telas:** Biblioteca de exercícios (lista + busca por grupo muscular); Fichas (lista de fichas por aluno) + montar/ver ficha (dias A/B/C, exercícios com séries/reps/carga/descanso).
- **Componentes:** `TreinosView`, `ExercicioTable`, `FichaBuilder`/`FichaCard`.
- **Testes:** service (resolver `exercicioId`→exercício), FichaCard, filtro por músculo.

### 2. Dieta  · dados: ⚠️ **falta coleção no db.json**
- **Adicionar ao `db.json`:** `planos_alimentares` (por aluno: metas kcal/proteína/carbo/gordura, refeições com itens/macros, nota do nutri) e opcional `alimentos`.
- **Telas:** Plano alimentar do aluno (macros do dia + refeições) + acompanhamento de adesão.
- **Componentes:** `DietaView`, `MacroResumo`, `RefeicaoCard`, `AdesaoChart` (SVG/CSS).
- **Testes:** service (somar macros), RefeicaoCard, cálculo de adesão.

### 3. Profissionais  · dados: ✅ prontos (`profissionais`, `alunos`)
- **Telas:** Lista de personais/nutris (especialidade, nº alunos, avaliação); Ficha do profissional + **carteira de alunos** (vinculados via campo do aluno).
- **Componentes:** `ProfissionaisView`, `ProfissionalCard`, `CarteiraAlunos`.
- **Testes:** service (contar alunos por profissional), ProfissionalCard, filtro por papel.

### 4. Gamificação  · dados: ✅ (`ranking`, `recompensas`, XP/streak nos `alunos`)
- **Adicionar ao `db.json` (opcional):** `conquistas` (catálogo) e `gamificacao_config` (regras XP/foguinhos).
- **Telas:** Ranking (pódio + lista), Catálogo de recompensas, Regras de pontuação, Conquistas.
- **Componentes:** `GamificacaoView`, `RankingPodium`, `RecompensaCard`, `RegrasForm` (read-only na demo).
- **Testes:** service (ordenar ranking por score), RankingPodium, RecompensaCard.

### 5. Relatórios / BI  · dados: ✅ (deriva de `faturas`, `acessos`, `alunos`, `contratos`)
- **Telas:** Dashboard executivo com KPIs + gráficos: receita/inadimplência, frequência (via acessos), novos/cancelados (churn), engajamento.
- **Componentes:** `RelatoriosView`, `KpiGrid`, `BarChart`/`LineChart` (SVG/CSS), tabelas de coorte.
- **Testes:** service (agregações: MRR, % inadimplência, churn), 1 gráfico.

### 6. Configurações  · dados: ✅ (`academia`, `unidades`, `usuarios`, `planos`)
- **Telas:** Dados da academia/unidades; Usuários & permissões (lista + papéis); Integrações (gateway/catraca/push — cards de status); Preferências (tema).
- **Componentes:** `ConfiguracoesView` com `Tabs` (Geral, Usuários, Integrações, Preferências).
- **Testes:** service (listar usuários/unidades), UsuariosTable.

---

## Ordem sugerida e esforço

Por facilidade (dados prontos primeiro) e impacto de demo:

| Ordem | Módulo | Dados | Esforço* |
|---|---|---|---|
| 1 | Treinos | prontos | ~0,5 dia |
| 2 | Profissionais | prontos | ~0,5 dia |
| 3 | Configurações | prontos | ~0,5 dia |
| 4 | Gamificação | +conquistas/config | ~0,5–1 dia |
| 5 | Relatórios | deriva | ~0,5–1 dia |
| 6 | Dieta | +coleção no db.json | ~1 dia |

\* estimativa para 1 dev seguindo o padrão já estabelecido. Rodando em paralelo (como os flagship), tudo sai bem mais rápido.

## Checklist de "pronto" (por módulo)
- [ ] `npm test` verde (testes do domínio passando)
- [ ] `npm run build` compila
- [ ] rota resolve e usa o UI kit
- [ ] `nav.ts` com `status: "pronto"` (sem "EM BREVE")
- [ ] dados vindos do json-server / `/api` (nada estático)
