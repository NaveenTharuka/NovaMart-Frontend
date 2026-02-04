import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,          // listen on all network interfaces
    port: 5173,          // optional, default Vite port
    strictPort: true,    // prevent automatic port change
    allowedHosts: [
      '.ngrok-free.dev', // allow ngrok subdomains
      'localhost',       // allow localhost
    ],
  },
})
