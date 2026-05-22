import { motion as Motion } from 'motion/react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { getPastPaintings } from '../lib/content'
import MediaPlaceholder from '../components/MediaPlaceholder'

export default function PastWorks() {
  let paintings = []

  try {
    paintings = getPastPaintings()
  } catch {
    paintings = []
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink">
      <SEOHead
        title="Past Works"
        description="An archive of Sadaf's works now in private collections."
      />

      <section className="border-b border-gray-100 bg-brand-bg pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted sm:mb-6">
            Past Works
          </span>
          <h1 className="mb-6 text-4xl font-serif leading-[0.95] tracking-tight text-brand-ink sm:text-5xl md:text-6xl lg:text-7xl">
            Past Works
          </h1>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-brand-muted sm:text-[15px] md:text-base">
            An archive of original paintings now in private collections. To inquire about commissioning a similar piece, please get in touch.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {paintings.length === 0 ? (
            <p className="text-brand-muted text-sm font-light">No archived works yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
              {paintings.map((painting) => (
                <Motion.div
                  key={painting.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col"
                >
                  <Link to={`/paintings/${painting.slug}`} className="relative aspect-[4/5] overflow-hidden bg-transparent">
                    {painting.thumbnail_image || painting.featured_image ? (
                      <img
                        src={painting.thumbnail_image || painting.featured_image}
                        alt={painting.title}
                        className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <MediaPlaceholder text="View Work" />
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-brand-muted">
                      {painting.availability === 'sold' ? 'In Private Collection' : 'Not for Sale'}
                    </span>
                    <div className="absolute inset-0 hidden bg-black/0 transition-colors sm:flex group-hover:bg-black/20 items-center justify-center">
                      <Motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300"
                      >
                        View work
                      </Motion.span>
                    </div>
                  </Link>

                  <div className="mt-4 flex justify-center">
                    <Link
                      to={`/paintings/${painting.slug}`}
                      className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors duration-300"
                    >
                      View
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
