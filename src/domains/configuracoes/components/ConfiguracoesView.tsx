"use client";

import { useState } from "react";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Tabs } from "@/shared/ui/Tabs";
import { useConfiguracoes } from "../hooks/useConfiguracoes";
import { usuariosAtivos } from "../services/configuracoes-service";
import { GeralPanel } from "./GeralPanel";
import { UsuariosTable } from "./UsuariosTable";
import { IntegracoesPanel } from "./IntegracoesPanel";
import { PreferenciasPanel } from "./PreferenciasPanel";

type TabKey = "geral" | "usuarios" | "integracoes" | "preferencias";

const TABS: { key: TabKey; label: string }[] = [
  { key: "geral", label: "Geral" },
  { key: "usuarios", label: "Usuários" },
  { key: "integracoes", label: "Integrações" },
  { key: "preferencias", label: "Preferências" },
];

/** Tela raiz de /configuracoes: 4 abas (geral, usuários, integrações, preferências). */
export function ConfiguracoesView() {
  const { data, loading, error } = useConfiguracoes();
  const [tab, setTab] = useState<TabKey>("geral");

  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Academia, unidades, usuários, integrações e preferências do sistema"
      >
        <Tabs items={TABS} activeKey={tab} onChange={(k) => setTab(k as TabKey)} />
      </PageHeader>

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar as configurações"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        <div>
          {tab === "geral" && (
            <GeralPanel
              academia={data.academia}
              unidades={data.unidades}
              planos={data.planos}
            />
          )}

          {tab === "usuarios" && (
            <Card
              flush
              title="Usuários internos"
              action={
                <span className="font-body text-xs text-text-muted">
                  {usuariosAtivos(data.usuarios)} de {data.usuarios.length} ativos
                </span>
              }
            >
              <UsuariosTable usuarios={data.usuarios} unidades={data.unidades} />
            </Card>
          )}

          {tab === "integracoes" && <IntegracoesPanel integracoes={data.integracoes} />}

          {tab === "preferencias" && <PreferenciasPanel />}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-40 animate-pulse rounded-card border border-border bg-card-alt" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
    </div>
  );
}
