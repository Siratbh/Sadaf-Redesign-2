import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEOHead from '../components/SEOHead'
import Lightbox from '../components/Lightbox'
import { getExhibition, getPainting, getPage } from '../lib/content'
import { mediaType, extractYouTubeId, youtubeEmbedUrl, vimeoEmbedUrl } from '../lib/media'
import { formatDateRange } from '../lib/exhibitions'

// Visual play indicator drawn over a video thumbnail. Uses <span> elements so
// it's safe to drop inside react-markdown's paragraph wrappers without producing
// invalid HTML (div-in-p hydration warnings).
function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center">
        <span className="block w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white ml-1" />
      </span>
    </span>
  )
}

// Renders a clickable thumbnail for a single media item (image, mp4, YouTube, Vimeo)
function MediaThumb({ src, type, caption, onClick, eager }) {
  if (type === 'image') {
    return (
      <img
        src={src}
        alt={caption || ''}
        className="w-full h-auto cursor-zoom-in"
        onClick={onClick}
        loading={eager ? 'eager' : 'lazy'}
      />
    )
  }
  if (type === 'video') {
    return (
      <div className="relative w-full cursor-pointer group" onClick={onClick}>
        <video
          src={src}
          preload="metadata"
          muted
          playsInline
          className="w-full h-auto block bg-black"
        />
        <PlayBadge />
      </div>
    )
  }
  if (type === 'youtube') {
    const id = extractYouTubeId(src)
    const poster = id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null
    return (
      <div className="relative w-full cursor-pointer aspect-video bg-black" onClick={onClick}>
        {poster && (
          <img
            src={poster}
            alt={caption || ''}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }}
          />
        )}
        <PlayBadge />
      </div>
    )
  }
  if (type === 'vimeo') {
    return (
      <div className="relative w-full cursor-pointer aspect-video bg-neutral-900 flex items-center justify-center" onClick={onClick}>
        <PlayBadge />
        <span className="absolute bottom-3 right-4 text-white/40 text-[10px] uppercase tracking-[0.2em]">Vimeo</span>
      </div>
    )
  }
  return null
}

export default function ExhibitionDetail() {
  const { slug } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  let ex = null
  try {
    ex = getExhibition(slug)
  } catch {
    ex = null
  }

  // Shared chrome — labels/headings used across every exhibition page.
  const c = getPage('exhibition-detail-chrome') || {}

  // Collect every media item in a single ordered list for the lightbox.
  // Order: hero → inline markdown media (in document order) → gallery items.
  const { allMedia, heroIndex, inlineStart, galleryStart, heroType, heroSrc } = useMemo(() => {
    if (!ex) return { allMedia: [], heroIndex: -1, inlineStart: 0, galleryStart: 0, heroType: null, heroSrc: null }

    const media = []
    let heroIdx = -1
    let hType = null
    let hSrc = null

    if (ex.hero_video) {
      heroIdx = media.length
      hType = mediaType(ex.hero_video)
      hSrc = ex.hero_video
      media.push({ src: ex.hero_video, type: hType, caption: ex.title })
    } else if (ex.hero_image) {
      heroIdx = media.length
      hType = 'image'
      hSrc = ex.hero_image
      media.push({ src: ex.hero_image, type: 'image', caption: ex.title })
    }

    const iStart = media.length
    if (ex.body) {
      const inlineMatches = [...ex.body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]
      for (const m of inlineMatches) {
        media.push({ src: m[2], type: mediaType(m[2]), caption: m[1] || '' })
      }
    }

    const gStart = media.length
    if (Array.isArray(ex.gallery)) {
      for (const g of ex.gallery) {
        if (!g) continue
        if (g.video) {
          media.push({ src: g.video, type: mediaType(g.video), caption: g.caption || '' })
        } else if (g.image) {
          media.push({ src: g.image, type: 'image', caption: g.caption || '' })
        }
      }
    }

    return { allMedia: media, heroIndex: heroIdx, inlineStart: iStart, galleryStart: gStart, heroType: hType, heroSrc: hSrc }
  }, [ex])

  // Look up the lightbox index for an inline media item by its src
  const inlineSrcToIndex = useMemo(() => {
    const map = new Map()
    if (!ex?.body) return map
    const inlineMatches = [...ex.body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]
    inlineMatches.forEach((m, i) => {
      map.set(m[2], inlineStart + i)
    })
    return map
  }, [ex, inlineStart])

  if (!ex) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-ink px-4">
        <div className="text-center">
          <h1 className="text-4xl font-serif italic mb-4">{c.not_found_title || 'Exhibition not found.'}</h1>
          <Link to="/exhibitions" className="text-[11px] uppercase tracking-[0.2em] font-bold border-b border-brand-ink pb-1 text-brand-ink">
            {c.back_link_label || '← The Archive'}
          </Link>
        </div>
      </div>
    )
  }

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Markdown renderer: inline images use ![alt](url). If url is a video, render video player; else <img>.
  const markdownComponents = {
    img: ({ src, alt }) => {
      const idx = inlineSrcToIndex.get(src)
      const type = mediaType(src)
      const onClick = () => idx != null && openLightbox(idx)

      if (type === 'image') {
        return <img src={src} alt={alt || ''} onClick={onClick} loading="lazy" />
      }
      if (type === 'video') {
        return (
          <span className="relative block cursor-pointer group" onClick={onClick}>
            <video src={src} preload="metadata" muted playsInline className="w-full h-auto block bg-black my-8" />
            <PlayBadge />
          </span>
        )
      }
      if (type === 'youtube') {
        const url = youtubeEmbedUrl(src)
        return (
          <span className="block my-8">
            <iframe
              src={url}
              title={alt || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full aspect-video bg-black"
            />
          </span>
        )
      }
      if (type === 'vimeo') {
        const url = vimeoEmbedUrl(src)
        return (
          <span className="block my-8">
            <iframe
              src={url}
              title={alt || 'Vimeo video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video bg-black"
            />
          </span>
        )
      }
      return null
    },
    a: ({ href, children }) => (
      <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    ),
  }

  const dateLabel = formatDateRange(ex.start_date, ex.end_date, ex.year)
  const metaPrefix = [ex.exhibition_type && `${ex.exhibition_type} Exhibition`, dateLabel].filter(Boolean).join(' · ')

  return (
    <>
      <SEOHead
        title={ex.title}
        description={ex.description || (ex.body ? ex.body.replace(/[#>*_`]/g, '').slice(0, 160) : undefined)}
        image={ex.hero_image}
      />

      <div className="min-h-screen bg-brand-bg text-brand-ink" {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}>
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-4 sm:px-6 md:pt-32">
          <Link to="/exhibitions" className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted hover:text-brand-ink transition-colors">
            {c.back_link_label || '← The Archive'}
          </Link>
        </div>

        <Motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10 md:pt-12 md:pb-14"
        >
          {metaPrefix && (
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-brand-muted mb-5">
              {metaPrefix}
            </p>
          )}
          <h1 className="text-4xl font-serif leading-[1.05] sm:text-5xl md:text-6xl" data-sb-field-path="title">{ex.title}</h1>
          <p className="mt-4 text-sm text-brand-muted">
            <span data-sb-field-path="venue">{ex.venue}</span>{ex.city ? <>, <span data-sb-field-path="city">{ex.city}</span></> : ''}
          </p>
        </Motion.header>

        {heroSrc && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-16"
          >
            <MediaThumb
              src={heroSrc}
              type={heroType}
              caption={ex.title}
              onClick={() => openLightbox(heroIndex)}
              eager
            />
          </Motion.div>
        )}

        {ex.description && !ex.body && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
            <p className="text-[15px] leading-[1.8] text-brand-muted md:text-[17px] whitespace-pre-line" data-sb-field-path="description">
              {ex.description}
            </p>
          </section>
        )}

        {ex.body && (
          // The body content lives BELOW the frontmatter in the .md file. Stackbit
          // exposes that under the canonical field name `markdown_content` — annotating
          // with `body` would point at a non-existent frontmatter field and the
          // Visual Editor modal would open empty (risking content loss on save).
          <article className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 md:pb-20 prose-editorial" data-sb-field-path="markdown_content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {ex.body}
            </ReactMarkdown>
          </article>
        )}

        {Array.isArray(ex.gallery) && ex.gallery.length > 0 && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 md:pb-28 space-y-12 md:space-y-16">
            {ex.gallery.map((g, i) => {
              if (!g || (!g.image && !g.video)) return null
              const src = g.video || g.image
              const type = g.video ? mediaType(g.video) : 'image'
              return (
                <Motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                >
                  <MediaThumb
                    src={src}
                    type={type}
                    caption={g.caption}
                    onClick={() => openLightbox(galleryStart + i)}
                  />
                  {g.caption && (
                    <figcaption className="mt-3 text-xs text-brand-muted text-center">
                      {g.caption}
                    </figcaption>
                  )}
                </Motion.figure>
              )
            })}
          </section>
        )}

        {Array.isArray(ex.works_shown) && ex.works_shown.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 md:pb-28">
            <div className="mb-10 border-b border-gray-100 pb-6 md:mb-12 md:pb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted mb-3">{c.works_shown_eyebrow || 'Works'}</p>
              <h2 className="font-serif italic text-brand-ink text-3xl md:text-4xl lg:text-5xl leading-[1.05]">{c.works_shown_title || 'Works Shown'}</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
              {ex.works_shown.map((slug) => {
                const p = getPainting(slug)
                if (!p) return null
                const img = p.featured_image || p.thumbnail_image
                return (
                  <Link
                    key={slug}
                    to={`/paintings/${p.slug}`}
                    className="group flex flex-col"
                    {...(p._id ? { 'data-sb-object-id': p._id } : {})}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      {img ? (
                        <img
                          src={img}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          data-sb-field-path={p.featured_image ? 'featured_image' : 'thumbnail_image'}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs uppercase tracking-[0.2em]">
                          {p.title}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="font-serif italic text-brand-ink text-lg md:text-xl leading-[1.15] group-hover:text-brand-accent transition-colors" data-sb-field-path="title">
                        {p.title}
                      </h3>
                      {p.year && (
                        <p className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-brand-muted" data-sb-field-path="year">
                          {p.year}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {ex.link && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 text-center">
            <a
              href={ex.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-[0.2em] font-bold border-b border-brand-ink pb-1 text-brand-ink hover:text-brand-accent hover:border-brand-accent transition-colors"
            >
              {c.read_more_label || 'Read more →'}
            </a>
          </div>
        )}
      </div>

      <Lightbox
        images={allMedia}
        startIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
