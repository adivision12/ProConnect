// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // port: 5173, // ✅ Changed to avoid conflict with backend
    proxy: {
      "/api": {
        target: "https://localhost:4001", // Your backend
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // Optional: remove /api prefix
      }
    }
  }
})
