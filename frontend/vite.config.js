import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  console.log("Vite Mode:", mode); // Debugging mode

  const env = loadEnv(mode, process.cwd(), "");

  console.log("✅ VITE_API_URL:", env.VITE_API_URL);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000", // Default to local if env is missing
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/,""),
        }
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(`${env.VITE_API_URL}/api`),
    },
  };
});
