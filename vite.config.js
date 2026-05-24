import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Dev-only: make /admin/ resolve to public/admin/index.html.
// Vite's dev server otherwise falls through to the SPA shell for trailing-slash
// URLs, so the Decap admin only loads via the explicit /admin/index.html path.
const decapAdminDirIndex = () => ({
  name: 'decap-admin-dir-index',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/admin' || req.url === '/admin/') {
        req.url = '/admin/index.html'
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), decapAdminDirIndex()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
