import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: path.resolve(__dirname, "apps/miniapp"),
  envDir: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/miniapp/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/miniapp"),
    emptyOutDir: true,
  },
});