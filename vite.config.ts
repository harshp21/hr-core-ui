import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("@mui/x-data-grid")) {
            return "mui-data-grid";
          }

          if (id.includes("@mui/icons-material")) {
            return "mui-icons";
          }

          if (id.includes("@mui/material") || id.includes("@mui/system") || id.includes("@mui/utils")) {
            return "mui-core";
          }

          if (id.includes("@emotion")) {
            return "emotion";
          }

          if (id.includes("@tanstack/react-query") || id.includes("react-router-dom")) {
            return "app-framework";
          }

          if (id.includes("recharts")) {
            return "charts";
          }

          if (id.includes("axios")) {
            return "http";
          }

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }

          return "vendor";
        },
      },
    },
  },
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
  plugins: [react()],
});
