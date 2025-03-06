import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: mode === "development" ? {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Local backend during development
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      }
    },
  } : {},
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      mode === "development"
        ? "http://localhost:8000/api" // Use local backend in dev
        : "https://strive-app-backend.onrender.com/api" // Use deployed backend in prod
    ),
  },
}));
