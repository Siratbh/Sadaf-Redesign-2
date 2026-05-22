// Content loader using Vite's import.meta.glob
// Parses YAML frontmatter from markdown strings

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { data: {}, content: raw }

  const yamlStr = match[1]
  const content = raw.slice(match[0].length).trim()
  const data = {}

  const lines = yamlStr.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) { i++; continue }

    const key = line.slice(0, colonIdx).trim()
    const rest = line.slice(colonIdx + 1).trim()

    // Block scalar: >- or | (folded/literal)
    if (rest === '>-' || rest === '>' || rest === '|' || rest === '|-') {
      const blockLines = []
      i++
      // Collect indented continuation lines
      while (i < lines.length && (lines[i].startsWith(' ') || lines[i].startsWith('\t') || lines[i].trim() === '')) {
        blockLines.push(lines[i].trimStart())
        i++
      }
      // For folded (>-/>): collapse single newlines into spaces, keep blank lines as paragraph breaks
      if (rest === '>-' || rest === '>') {
        let result = ''
        for (let j = 0; j < blockLines.length; j++) {
          if (blockLines[j] === '') {
            result = result.trimEnd() + '\n\n'
          } else {
            result += (result.length > 0 && !result.endsWith('\n') ? ' ' : '') + blockLines[j]
          }
        }
        data[key] = result.trim()
      } else {
        // Literal (|): preserve newlines as-is
        data[key] = blockLines.join('\n').trim()
      }
      continue
    }

    let value = rest

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    // Boolean
    if (value === 'true') value = true
    else if (value === 'false') value = false
    // Number
    else if (!isNaN(value) && value !== '') value = Number(value)

    data[key] = value
    i++
  }

  return { data, content }
}

// Eager glob imports
const paintingFiles = import.meta.glob('/content/paintings/*.md', { query: '?raw', import: 'default', eager: true })

const exhibitionFiles = import.meta.glob('/content/exhibitions/*.md', { query: '?raw', import: 'default', eager: true })
const collectorFiles = import.meta.glob('/content/collectors/*.md', { query: '?raw', import: 'default', eager: true })
const pageFiles = import.meta.glob('/content/pages/*.md', { query: '?raw', import: 'default', eager: true })

// _id is the file path relative to project root (used for Stackbit visual editor annotations)
export function getPaintings() {
  return Object.entries(paintingFiles)
    .map(([filePath, raw]) => {
      const { data, content } = parseFrontmatter(raw)
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
      const { data, content } = parseFrontmatter(raw)
      return { ...data, body: content, _id: filePath.slice(1) }
    })
    .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
}

export function getPage(slug) {
  const entry = Object.entries(pageFiles).find(([p]) => p.endsWith(`/${slug}.md`))
  if (!entry) return null
  const [filePath, raw] = entry
  const { data, content } = parseFrontmatter(raw)
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



export function getCollectors() {
  return Object.entries(collectorFiles)
    .map(([filePath, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      return { ...data, body: content, _id: filePath.slice(1) }
    })
    .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
}
