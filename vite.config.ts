import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // three plus the react-three-fiber runtime, so the whole WebGL
          // stack stays in the chunk the lazy scenes pull in. `scheduler` is
          // deliberately excluded: react-dom needs it in the entry.
          if (/[\\/](three|@react-three|react-reconciler|its-fine|suspend-react|zustand)[\\/]/.test(id)) {
            return "three";
          }
          if (/[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return "motion";
        },
      },
    },
  },
});
