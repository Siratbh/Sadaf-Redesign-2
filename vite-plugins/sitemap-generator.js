import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import yaml from 'js-yaml'

const SITE_URL = 'https://sadaffarasat.com'

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  try { return yaml.load(match[1]) || {} } catch { return {} }
}

export default function sitemapGenerator() {
  return {
    name: 'sitemap-generator',
    apply: 'build',
    async closeBundle() {
      const root = process.cwd()
      const today = new Date().toISOString().split('T')[0]

      const paintingFiles = await readdir(join(root, 'content/paintings'))
      const paintingSlugs = []
      for (const file of paintingFiles.filter(f => f.endsWith('.md'))) {
        const raw = await readFile(join(root, 'content/paintings', file), 'utf-8')
        const data = parseFrontmatter(raw)
        if (data.slug) paintingSlugs.push(data.slug.trim())
      }

      const exhibitionFiles = await readdir(join(root, 'content/exhibitions'))
      const exhibitionSlugs = []
      for (const file of exhibitionFiles.filter(f => f.endsWith('.md'))) {
        const raw = await readFile(join(root, 'content/exhibitions', file), 'utf-8')
        const data = parseFrontmatter(raw)
        if (data.body || data.description || data.link) {
          exhibitionSlugs.push(file.replace(/\.md$/, ''))
        }
      }

      const staticRoutes = [
        { path: '/',                  priority: '1.0', changefreq: 'weekly' },
        { path: '/available',         priority: '0.9', changefreq: 'weekly' },
        { path: '/past-works',        priority: '0.8', changefreq: 'monthly' },
        { path: '/about',             priority: '0.8', changefreq: 'monthly' },
        { path: '/exhibitions',       priority: '0.8', changefreq: 'monthly' },
        { path: '/collectors-edit',   priority: '0.7', changefreq: 'monthly' },
        { path: '/contact',           priority: '0.6', changefreq: 'yearly' },
      ]

      const urls = [
        ...staticRoutes,
        ...paintingSlugs.map(slug => ({ path: `/paintings/${slug}`, priority: '0.7', changefreq: 'monthly' })),
        ...exhibitionSlugs.map(slug => ({ path: `/exhibitions/${slug}`, priority: '0.6', changefreq: 'yearly' })),
      ]

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

      await writeFile(join(root, 'dist/sitemap.xml'), xml, 'utf-8')
      console.log(`[sitemap] Generated dist/sitemap.xml with ${urls.length} URLs`)
    },
  }
}
