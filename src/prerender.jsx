import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { getPaintings, getExhibitions, getPage } from './lib/content'
import siteSettings from '../content/settings/site.json'

const SITE_URL = 'https://sadaffarasat.com'

function buildFullTitle(pageTitle) {
  return pageTitle
    ? `${pageTitle} — ${siteSettings.title}`
    : siteSettings.seo_title
}

function buildHeadElements(title, description, canonicalUrl, image, ogType = 'website') {
  const elements = new Set([
    { type: 'meta', props: { name: 'description', content: description } },
    { type: 'link', props: { rel: 'canonical', href: canonicalUrl } },
    { type: 'meta', props: { property: 'og:title', content: title } },
    { type: 'meta', props: { property: 'og:description', content: description } },
    { type: 'meta', props: { property: 'og:url', content: canonicalUrl } },
    { type: 'meta', props: { property: 'og:site_name', content: 'Sadaf Farasat Fine Art' } },
    { type: 'meta', props: { property: 'og:type', content: ogType } },
    { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
    { type: 'meta', props: { name: 'twitter:title', content: title } },
    { type: 'meta', props: { name: 'twitter:description', content: description } },
  ])
  if (image) {
    const abs = image.startsWith('http') ? image : `${SITE_URL}${image}`
    elements.add({ type: 'meta', props: { property: 'og:image', content: abs } })
    elements.add({ type: 'meta', props: { name: 'twitter:image', content: abs } })
  }
  return elements
}

function getRouteHead(path) {
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`

  if (path === '/') {
    const t = siteSettings.seo_title
    const d = siteSettings.seo_description
    return { title: t, elements: buildHeadElements(t, d, canonical, '/images/about/Sadaf-Hero-Portrait.jpg') }
  }

  // /paintings/:slug
  const paintingMatch = path.match(/^\/paintings\/(.+)$/)
  if (paintingMatch) {
    const painting = getPaintings().find(p => p.slug === paintingMatch[1])
    if (painting) {
      const t = buildFullTitle(painting.seo_title || painting.title)
      const d = painting.seo_description
        || painting.short_description
        || (painting.medium && painting.year
          ? `${painting.medium}${painting.dimensions ? `, ${painting.dimensions}` : ''}, ${painting.year}. An original painting by Sadaf Farasat.`
          : siteSettings.seo_description)
      return {
        title: t,
        elements: buildHeadElements(t, d, canonical, painting.featured_image || painting.thumbnail_image, 'article'),
      }
    }
  }

  // /exhibitions/:slug
  const exhibitionMatch = path.match(/^\/exhibitions\/(.+)$/)
  if (exhibitionMatch) {
    const ex = getExhibitions().find(e => e.slug === exhibitionMatch[1])
    if (ex) {
      const t = buildFullTitle(ex.title)
      const d = ex.description
        || `${ex.title}${ex.venue ? ` at ${ex.venue}` : ''}${ex.year ? `, ${ex.year}` : ''}. Exhibition by Sadaf Farasat.`
      return {
        title: t,
        elements: buildHeadElements(t, d, canonical, ex.hero_image || ex.image, 'article'),
      }
    }
  }

  // Static pages
  const pageKeyMap = {
    '/available': 'available',
    '/past-works': 'past-works',
    '/about': 'about',
    '/exhibitions': 'exhibitions',
    '/collectors-edit': 'collectors-edit',
    '/contact': 'contact',
  }
  const pageKey = pageKeyMap[path]
  if (pageKey) {
    const page = getPage(pageKey) || {}
    const t = buildFullTitle(page.seo_title || path.replace(/^\//, '').replace(/-/g, ' '))
    const d = page.seo_description || siteSettings.seo_description
    return { title: t, elements: buildHeadElements(t, d, canonical, null) }
  }

  const t = siteSettings.seo_title
  const d = siteSettings.seo_description
  return { title: t, elements: buildHeadElements(t, d, canonical, null) }
}

export async function prerender(data) {
  const url = (data && data.url) || '/'
  const path = url.replace(/^https?:\/\/[^/]+/, '') || '/'

  let html = ''
  try {
    html = renderToString(
      React.createElement(StaticRouter, { location: path },
        React.createElement(App)
      )
    )
  } catch (err) {
    console.error(`[prerender] ${path}:`, err.message)
  }

  const routeHead = getRouteHead(path)

  const paintings = getPaintings()
  const exhibitions = getExhibitions()

  const links = new Set([
    '/available',
    '/past-works',
    '/about',
    '/exhibitions',
    '/collectors-edit',
    '/contact',
    ...paintings.map(p => `/paintings/${p.slug}`),
    ...exhibitions.filter(e => e.slug).map(e => `/exhibitions/${e.slug}`),
  ])

  return {
    html,
    links,
    head: {
      lang: 'en',
      title: routeHead.title,
      elements: routeHead.elements,
    },
  }
}
