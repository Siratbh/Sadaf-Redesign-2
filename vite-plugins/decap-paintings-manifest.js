// Generates public/admin/paintings-manifest.json from content/paintings/*.md.
// Decap CMS preview templates can't query other collections at runtime — this
// manifest is the bridge that lets the Pages previews render real painting
// thumbnails instead of placeholder tiles.
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const FRONT = /^---\r?\n([\s\S]*?)\r?\n---/
const PAINTINGS_DIR = path.resolve('content/paintings')
const OUT = path.resolve('public/admin/paintings-manifest.json')

function build() {
  if (!fs.existsSync(PAINTINGS_DIR)) return
  const files = fs.readdirSync(PAINTINGS_DIR).filter((f) => f.endsWith('.md'))
  const items = files
    .map((f) => {
      const raw = fs.readFileSync(path.join(PAINTINGS_DIR, f), 'utf8')
      const m = raw.match(FRONT)
      const d = m ? yaml.load(m[1]) || {} : {}
      return {
        slug: d.slug || f.replace(/\.md$/, ''),
        title: d.title || '',
        year: d.year || '',
        availability: d.availability || '',
        featured_image: d.featured_image || '',
        thumbnail_image: d.thumbnail_image || '',
        featured: !!d.featured,
        sort_order: typeof d.sort_order === 'number' ? d.sort_order : 99,
      }
    })
    .filter((p) => p.slug)
    .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))

  const next = JSON.stringify(items, null, 2) + '\n'
  let prev = ''
  try { prev = fs.readFileSync(OUT, 'utf8') } catch { /* first run */ }
  if (prev !== next) fs.writeFileSync(OUT, next)
}

export default function decapPaintingsManifest() {
  return {
    name: 'decap-paintings-manifest',
    buildStart() { build() },
    configureServer(server) {
      build()
      server.watcher.add(PAINTINGS_DIR)
      const trigger = (file) => {
        if (typeof file === 'string' && file.startsWith(PAINTINGS_DIR) && file.endsWith('.md')) build()
      }
      server.watcher.on('add', trigger).on('change', trigger).on('unlink', trigger)
    },
  }
}
