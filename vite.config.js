import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'
import decapPaintingsManifest from './vite-plugins/decap-paintings-manifest.js'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import sitemapGenerator from './vite-plugins/sitemap-generator.js'

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

// After prerendering, animation libraries (GSAP, Lenis, Three.js) leave active timers
// in the Node.js event loop, preventing the process from exiting naturally. This plugin
// runs after all other closeBundle hooks and forces a clean exit so Netlify builds don't
// hang until their 18-minute timeout.
const forceExit = () => ({
  name: 'force-exit',
  apply: 'build',
  closeBundle: {
    order: 'post',
    handler() {
      process.exit(0)
    },
  },
})

// decode-named-character-reference/index.dom.js calls document.createElement('i') at
// module init time. When vite-prerender-plugin executes the bundle in Node.js, that
// line throws. This plugin replaces the module with an SSR-safe equivalent: same API,
// same DOM path in browsers, returns false (entity not found) in Node.js.
const ssrDecodeEntityCompat = () => ({
  name: 'ssr-decode-entity-compat',
  transform(_code, id) {
    if (!id.includes('decode-named-character-reference') || !id.endsWith('index.dom.js')) return
    return `
const element = typeof document !== 'undefined' ? document.createElement('i') : null

export function decodeNamedCharacterReference(value) {
  if (!element) return false
  const characterReference = '&' + value + ';'
  element.innerHTML = characterReference
  const character = element.textContent
  if (character.charCodeAt(character.length - 1) === 59 && value !== 'semi') {
    return false
  }
  return character === characterReference ? false : character
}
`
  },
})

export default defineConfig({
  plugins: [
    react(),
    ssrDecodeEntityCompat(),
    decapAdminDirIndex(),
    decapPaintingsManifest(),
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: path.resolve(__dirname, 'src/prerender.jsx'),
    }),
    sitemapGenerator(),
    forceExit(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
