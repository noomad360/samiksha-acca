import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['2f73-2407-1400-aa16-70a0-a5fd-fad8-3c85-d538.ngrok-free.app'],
  },
})
