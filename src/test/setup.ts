import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpa a árvore do React Testing Library após cada teste.
afterEach(() => {
  cleanup();
});
