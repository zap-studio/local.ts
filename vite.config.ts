import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  run: {
    cache: {
      scripts: false,
      tasks: true,
    },
    tasks: {
      routes: {
        command: "vp exec tsr generate",
      },
      "app:build": {
        command: "vp build",
        dependsOn: ["routes"],
      },
      "app:validate": {
        command: "vp test && vp check",
        dependsOn: ["app:build"],
        cache: false,
      },
    },
  },
  staged: {
    "*.{js,jsx,ts,tsx,json,jsonc,css,html}": "vp check --fix",
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
