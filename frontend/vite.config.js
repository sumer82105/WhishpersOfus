import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  base: '/',
  publicDir: 'public',
  server: {
    port: 5173,
    host: true
  },
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['sockjs-client']
  },
  // This helps Vercel (or Netlify) route properly for SPAs
  preview: {
    port: 4173,
    host: true,
  }
})
