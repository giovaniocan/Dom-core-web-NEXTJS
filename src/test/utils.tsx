import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/shared/layout/ThemeProvider";

/**
 * Wrapper padrão de testes: envolve o componente nos providers globais
 * (tema DomCore) para reproduzir o ambiente real da aplicação.
 */
function AllProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
