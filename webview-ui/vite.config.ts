import { defineConfig } from "vite";
import reactSWC from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [reactSWC()],
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
