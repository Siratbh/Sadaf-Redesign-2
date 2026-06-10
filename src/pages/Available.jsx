import { motion as Motion } from 'motion/react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import CdnImage from '../components/CdnImage'
import { getAvailablePaintings, getPage } from '../lib/content'
import MediaPlaceholder from '../components/MediaPlaceholder'

export default function Available() {
  let paintings = []

  try {
    paintings = getAvailablePaintings()
  } catch {
    paintings = []
  }

  const p = getPage('available') || {}

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink" {...(p._id ? { 'data-sb-object-id': p._id } : {})}>
      <SEOHead
        title={p.seo_title || 'Available Works'}
        description={p.seo_description || 'Original paintings by Sadaf currently available for acquisition.'}
      />

      <section className="border-b border-gray-100 bg-brand-bg pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted sm:mb-6" data-sb-field-path="hero_eyebrow">
            {p.hero_eyebrow || 'Available Works'}
          </span>
          <h1 className="mb-6 text-4xl font-serif leading-[0.95] tracking-tight text-brand-ink sm:text-5xl md:text-6xl lg:text-7xl" data-sb-field-path="hero_title">
            {p.hero_title || 'Available Works'}
          </h1>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-brand-muted sm:text-[15px] md:text-base" data-sb-field-path="hero_description">
            {p.hero_description || 'Original paintings currently available for acquisition. Each piece is a meditation on spirituality, abstraction, and the human experience.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {paintings.length === 0 ? (
            <p className="text-brand-muted text-sm font-light" data-sb-field-path="empty_state">
              {p.empty_state || 'No works currently available — please check back soon, or get in touch about commissions.'}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
              {paintings.map((painting) => (
                <Motion.div
                  key={painting.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col"
                  {...(painting._id ? { 'data-sb-object-id': painting._id } : {})}
                >
                  <Link to={`/paintings/${painting.slug}`} className="relative aspect-[4/5] overflow-hidden bg-transparent">
                    {painting.thumbnail_image || painting.featured_image ? (
                      <CdnImage
                        src={painting.thumbnail_image || painting.featured_image}
                        alt={painting.title}
                        widths={[300, 450, 600]}
                        sizes="(max-width: 768px) 45vw, 30vw"
                        fit="contain"
                        q={70}
                        className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        data-sb-field-path={painting.thumbnail_image ? 'thumbnail_image' : 'featured_image'}
                      />
                    ) : (
                      <MediaPlaceholder text="View Work" />
                    )}
                    <div className="absolute inset-0 hidden bg-black/0 transition-colors sm:flex group-hover:bg-black/20 items-center justify-center">
                      <Motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300"
                      >
                        {p.tile_hover_label || 'View this piece'}
                      </Motion.span>
                    </div>
                  </Link>

                  <div className="mt-4 flex justify-center">
                    <Link
                      to={`/paintings/${painting.slug}`}
                      className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors duration-300"
                    >
                      {p.tile_view_label || 'View'}
                    </Link>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
