import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/movies": "http://localhost:5001",
      "/theaters": "http://localhost:5001",
      "/reviews": "http://localhost:5001",
    },
  },
});
