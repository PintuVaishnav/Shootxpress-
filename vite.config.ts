import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    // remove Replit-only plugins for production
    // If you really want them in dev, you can wrap with NODE_ENV check:
    // ...(process.env.NODE_ENV === "development" ? [runtimeErrorOverlay()] : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),   // alias for client code
      "@shared": path.resolve(__dirname, "shared"), // shared schemas/models
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"), // frontend root
  build: {
    outDir: path.resolve(__dirname, "dist"), // output in dist/public
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": "http://localhost:5000", // local API forward
    },
  },
});