import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; 

export default defineConfig({
  plugins: [react()], 

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ["b9ae-197-244-201-138.ngrok-free.app"],
  },

  build: {
    sourcemap: false, 
  },
});
