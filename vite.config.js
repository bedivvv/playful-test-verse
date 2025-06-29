
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Include .js and .jsx files
      include: "**/*.{js,jsx,ts,tsx}",
    }),
    // Legacy browser support
    legacy({
      targets: ["defaults", "not IE 11"],
    }),

    // SVG as React components
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],

  // ESBuild configuration to handle JSX in .js files
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },

  // Define aliases
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@views": resolve(__dirname, "./src/views"),
      "@assets": resolve(__dirname, "./src/assets"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@config": resolve(__dirname, "./src/config"),
      "@context": resolve(__dirname, "./src/context"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@layouts": resolve(__dirname, "./src/layouts"),
      // Node.js polyfills for browser compatibility
      events: "events",
    },
  },

  // Server configuration - Use port 8080 as required
  server: {
    port: 8080,
    open: true,
    host: true,
    cors: true,
  },

  // Build configuration
  build: {
    outDir: "dist",
    sourcemap: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          apollo: ["@apollo/client", "apollo-boost"],
          mui: ["@mui/material", "@mui/icons-material", "@material-ui/core"],
          charts: ["chart.js", "react-chartjs-2"],
        },
      },
    },
  },

  // Environment variables
  envPrefix: "VITE_",

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@apollo/client",
      "@mui/material",
      "@mui/icons-material",
      "react-router-dom",
      "styled-components",
      "events",
      "react-hot-toast",
    ],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },

  // Define global constants
  define: {
    global: "globalThis",
    "process.env": {},
  },
});
