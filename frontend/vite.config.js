import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Move Vite cache out of node_modules to avoid Windows/OneDrive locks
  cacheDir: 'vite-cache',
  plugins: [react()],
  // Polling is more reliable on network/OneDrive folders
  server: {
    watch: {
      usePolling: true,
    },
  },
})
