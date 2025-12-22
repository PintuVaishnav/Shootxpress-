import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    
    // 🔒 SECURITY: Disable source maps in production
    sourcemap: false,
    
    // 🔒 SECURITY: Better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production (keeps console.error/warn)
        drop_console: mode === 'production',
        drop_debugger: true,
        // Remove dead code
        dead_code: true,
        // Collapse variables
        collapse_vars: true,
      },
      mangle: {
        // Mangle property names for better obfuscation
        properties: false, // Set to true for more obfuscation (may break code)
      },
      format: {
        // Remove comments
        comments: false,
      },
    },
    
    // 🔒 SECURITY: Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          vendor: ['react', 'react-dom'],
          // Separate UI library if using one
          // ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
        // Randomize chunk names to obscure structure
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
    
    // Target modern browsers only
    target: 'es2020',
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // 🔒 SECURITY: Define environment variables handling
  define: {
    // Prevent leaking of build-time info
    __DEV__: mode !== 'production',
  },
  
  server: {
    fs: {
      strict: true,
      deny: [
        "**/.*",           // Hidden files
        "**/*.env",        // Environment files
        "**/*.env.*",      // All env variants
        "**/server/**",    // Server code
        "**/node_modules/.cache/**",
      ],
    },
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  
  // 🔒 SECURITY: Preview server settings
  preview: {
    headers: {
      // Security headers for preview
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  // 🔒 SECURITY: Optimize dependencies
  optimizeDeps: {
    exclude: [], // Add any packages that shouldn't be pre-bundled
  },
  
  // Environment directory
  envDir: path.resolve(__dirname, "client"),
  
  // 🔒 SECURITY: Only allow specific env prefixes
  envPrefix: ['VITE_'],
}));