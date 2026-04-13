import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 700,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react-router-dom")) return "react-vendor";
            if (id.includes("react/")) return "react-vendor";
            if (id.includes("@radix-ui")) return "radix-ui";
            if (id.includes("@stripe")) return "stripe";
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("recharts") || id.includes("d3-")) return "charts";
            if (id.includes("@tanstack")) return "query";
            if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("/zod/")) return "forms";
            if (id.includes("date-fns") || id.includes("react-day-picker")) return "dates";
            if (id.includes("lucide-react") || id.includes("cmdk") || id.includes("sonner") || id.includes("vaul") || id.includes("embla-carousel")) return "ui-utils";
          }
        },
      },
    },
  },
}));
