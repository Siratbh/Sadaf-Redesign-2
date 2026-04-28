import { useEffect } from 'react'
import siteSettings from '../../content/settings/site.json'

export default function SEOHead({ title, description, image }) {
  const fullTitle = title ? `${title} \u2014 ${siteSettings.title}` : siteSettings.seo_title
  const metaDesc = description || siteSettings.seo_description

  useEffect(() => {
    document.title = fullTitle
    let desc = document.querySelector('meta[name="description"]')
    if (!desc) {
      desc = document.createElement('meta')
      desc.name = 'description'
      document.head.appendChild(desc)
    }
    desc.content = metaDesc
  }, [fullTitle, metaDesc])

  return null
}
