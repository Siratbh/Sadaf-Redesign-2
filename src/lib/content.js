// Content loader using Vite's import.meta.glob
// Parses YAML frontmatter from markdown strings via js-yaml (browser-safe, no Buffer dep)

import yaml from 'js-yaml'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parse(raw) {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, content: raw }
  let data = {}
  try {
    data = yaml.load(match[1]) || {}
  } catch (err) {
    console.error('YAML parse error:', err)
    data = {}
  }
  const content = raw.slice(match[0].length).trim()
  return { data, content }
}

// Eager glob imports
const paintingFiles = import.meta.glob('/content/paintings/*.md', { query: '?raw', import: 'default', eager: true })

const exhibitionFiles = import.meta.glob('/content/exhibitions/*.md', { query: '?raw', import: 'default', eager: true })
const galleryFiles = import.meta.glob('/content/gallery/*.md', { query: '?raw', import: 'default', eager: true })
const collectorFiles = import.meta.glob('/content/collectors/*.md', { query: '?raw', import: 'default', eager: true })
const pageFiles = import.meta.glob('/content/pages/*.md', { query: '?raw', import: 'default', eager: true })

// _id is the file path relative to project root (used for Stackbit visual editor annotations)
export function getPaintings() {
  return Object.entries(paintingFiles)
    .map(([filePath, raw]) => {
      const { data, content } = parse(raw)
      return { ...data, body: content, _id: filePath.slice(1) }
    })
    .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
}

export function getPainting(slug) {
  return getPaintings().find(p => p.slug === slug) || null
}

export function getExhibitions() {
  return Object.entries(exhibitionFiles)
    .map(([filePath, raw]) => {
      const { data, content } = parse(raw)
      const slug = filePath.split('/').pop().replace(/\.md$/, '')
      return { ...data, slug, body: content, _id: filePath.slice(1) }
    })
    .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
}

export function getExhibition(slug) {
  return getExhibitions().find(e => e.slug === slug) || null
}

export function getPage(slug) {
  const entry = Object.entries(pageFiles).find(([p]) => p.endsWith(`/${slug}.md`))
  if (!entry) return null
  const [filePath, raw] = entry
  const { data, content } = parse(raw)
  return { ...data, body: content, _id: filePath.slice(1) }
}

export function getFeaturedPaintings() {
  return getPaintings().filter(p => p.featured)
}

export function getAvailablePaintings() {
  return getPaintings().filter(p => p.availability === 'available')
}

export function getPastPaintings() {
  return getPaintings().filter(p => p.availability && p.availability !== 'available')
}

export function getExhibitionGallery() {
  const albums = Object.entries(galleryFiles)
    .map(([filePath, raw]) => {
      const { data } = parse(raw)
      return { ...data, _id: filePath.slice(1) }
    })
    .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))

  const pool = []
  for (const album of albums) {
    if (!Array.isArray(album.gallery)) continue
    for (const item of album.gallery) {
      if (!item || (!item.image && !item.video)) continue
      pool.push({
        image: item.image,
        video: item.video,
        caption: item.caption || album.title || '',
        sort_order: album.sort_order,
        _id: `${album._id}::${pool.length}`,
      })
    }
  }
  return pool
}

export function getCollectors() {
  return Object.entries(collectorFiles)
    .map(([filePath, raw]) => {
      const { data, content } = parse(raw)
      return { ...data, body: content, _id: filePath.slice(1) }
    })
    .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
}
