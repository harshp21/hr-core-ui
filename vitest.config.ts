import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": "/src/api",
      "@components": "/src/components",
      "@features": "/src/features",
      "@hooks": "/src/hooks",
      "@layouts": "/src/layouts",
      "@types": "/src/types",
      "@utils": "/src/utils",
      "@constants": "/src/constants",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        statements: 70,
        branches: 55,
        functions: 65,
        lines: 70,
      },
    },
  },
});
