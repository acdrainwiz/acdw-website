import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Split heavy third-party libraries into separate, cacheable vendor
        // chunks so the main entry stays small. Combined with route-level
        // React.lazy splitting (see App.tsx), this keeps every chunk well
        // under Vite's 500 kB warning threshold.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion')) return 'vendor-framer'
          if (id.includes('@stripe')) return 'vendor-stripe'
          if (id.includes('@clerk')) return 'vendor-clerk'
          if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-router'
          if (id.includes('@headlessui') || id.includes('@heroicons') || id.includes('lucide-react')) return 'vendor-ui'
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'vendor-react'
          return 'vendor'
        }
      }
    }
  }
})
