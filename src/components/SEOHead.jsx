import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import siteSettings from '../../content/settings/site.json'

const SITE_URL = 'https://sadaffarasat.com'

function setMeta(attrName, attrValue, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attrName}="${CSS.escape(attrValue)}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export default function SEOHead({ title, description, image }) {
  const fullTitle = title ? `${title} — ${siteSettings.title}` : siteSettings.seo_title
  const metaDesc = description || siteSettings.seo_description
  const { pathname } = useLocation()
  const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`
  const absImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : null

  useEffect(() => {
    document.title = fullTitle

    setMeta('name', 'description', metaDesc)
    setLink('canonical', canonicalUrl)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', metaDesc)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:site_name', 'Sadaf Farasat Fine Art')
    setMeta('property', 'og:type', image ? 'article' : 'website')
    setMeta('property', 'og:image', absImage)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', metaDesc)
    setMeta('name', 'twitter:image', absImage)
  }, [fullTitle, metaDesc, canonicalUrl, absImage, image])

  return null
}
