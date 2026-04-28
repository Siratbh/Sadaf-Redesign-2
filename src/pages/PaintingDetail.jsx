import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import InquiryPanel from '../components/InquiryPanel'
import { getPainting, getPaintings } from '../lib/content'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MediaPlaceholder from '../components/MediaPlaceholder'

gsap.registerPlugin(ScrollTrigger)

export default function PaintingDetail() {
  const { slug } = useParams()
  const [panelOpen, setPanelOpen] = useState(false)

  let painting = null
  let allPaintings = []
  try {
    painting = getPainting(slug)
    allPaintings = getPaintings()
  } catch (error) {}

  // Prev / next
  const idx = allPaintings.findIndex(p => p.slug === slug)
  const prev = idx > 0 ? allPaintings[idx - 1] : null
  const next = idx < allPaintings.length - 1 ? allPaintings[idx + 1] : null

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-item').forEach(item => {
        gsap.fromTo(item,
          { y: 50, opacity: 0, filter: 'blur(8px)', scale: 0.98 },
          {
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'power3.out',
          }
        )
      })
    })
    return () => { ctx.revert() }
  }, [slug])

  if (!painting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-ink px-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl italic mb-4">Work not found.</h1>
          <Link to="/collections" className="font-label text-[10px] uppercase tracking-widest border-b border-brand-accent pb-1">
            ← Browse Collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={painting.seo_title || painting.title}
        description={painting.seo_description || painting.short_description}
      />
      <InquiryPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        paintingTitle={painting.title}
      />

      <div className="min-h-screen bg-brand-bg text-brand-ink">
        {/* Back nav */}
        <div className="px-6 md:px-24 pt-28 pb-8">
          <Link
            to={painting.collection ? `/collections/${painting.collection}` : '/collections'}
            className="font-label text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-ink transition-colors"
          >
            ← {painting.collection ? 'Back to Series' : 'Collections'}
          </Link>
        </div>

        {/* Main layout */}
        <div className="px-6 md:px-24 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Image column */}
            <div className="lg:col-span-7 reveal-item">
              <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                {painting.featured_image ? (
                  <img
                    src={painting.featured_image}
                    alt={painting.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <MediaPlaceholder text="Image Forthcoming" />
                )}
              </div>
            </div>

            {/* Info column */}
            <div className="lg:col-span-5 flex flex-col justify-start pt-0 lg:pt-8">
              {/* Title */}
              <div className="mb-10 reveal-item">
                {painting.collection && (
                  <Link
                    to={`/collections/${painting.collection}`}
                    className="font-label text-[10px] uppercase tracking-[0.3em] text-brand-muted mb-3 block hover:text-brand-ink transition-colors"
                  >
                    {painting.collection.replace(/-/g, ' ')}
                  </Link>
                )}
                <h1 className="font-headline text-[8vw] lg:text-[4vw] leading-[0.85] tracking-tighter italic mb-2">
                  {painting.title}
                </h1>
                <p className="font-label text-[10px] uppercase tracking-widest text-brand-muted">
                  {painting.year}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-4 mb-10 border-t border-gray-200 pt-8 reveal-item">
                {[
                  { label: 'Medium', value: painting.medium },
                  { label: 'Dimensions', value: painting.dimensions },
                  { label: 'Year', value: painting.year },
                  {
                    label: 'Availability',
                    value: painting.availability === 'available' ? 'Available' :
                           painting.availability === 'sold' ? 'Sold' : 'Enquire',
                  },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex justify-between items-baseline">
                    <span className="font-label text-[10px] uppercase tracking-widest text-brand-muted">{row.label}</span>
                    <span className="font-body text-sm text-brand-ink">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {painting.short_description && (
                <div className="mb-10 reveal-item">
                  <p className="font-body text-base text-brand-muted leading-relaxed">
                    {painting.short_description}
                  </p>
                </div>
              )}

              {/* CTA */}
              {painting.availability !== 'sold' && (
                <div className="mt-auto reveal-item">
                  <button
                    onClick={() => setPanelOpen(true)}
                    className="w-full bg-brand-ink text-brand-bg py-5 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-colors"
                  >
                    Inquire About This Piece
                  </button>
                  <p className="font-label text-[10px] uppercase tracking-widest text-brand-muted text-center mt-4">
                    Private viewing available on request
                  </p>
                </div>
              )}
              {painting.availability === 'sold' && (
                <div className="mt-auto border-t border-gray-200 pt-6 reveal-item">
                  <p className="font-label text-[10px] uppercase tracking-widest text-brand-muted text-center">
                    This work is in a private collection.
                  </p>
                  <button
                    onClick={() => setPanelOpen(true)}
                    className="w-full mt-4 border border-gray-300 text-brand-ink py-4 font-label text-[10px] uppercase tracking-[0.3em] hover:border-brand-ink transition-colors"
                  >
                    Inquire About Similar Works
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full description */}
          {painting.full_description && (
            <div className="mt-24 pt-16 border-t border-gray-200 max-w-2xl reveal-item">
              <span className="font-label text-[10px] uppercase tracking-widest text-brand-muted mb-6 block">Artist's Note</span>
              <div className="font-body text-base text-brand-muted leading-relaxed whitespace-pre-line">
                {painting.full_description}
              </div>
            </div>
          )}

          {/* Prev / Next */}
          {(prev || next) && (
            <div className="mt-24 pt-8 border-t border-gray-200 flex justify-between items-center reveal-item">
              {prev ? (
                <Link to={`/paintings/${prev.slug}`} className="group">
                  <span className="font-label text-[10px] uppercase tracking-widest text-brand-muted block mb-1">← Previous</span>
                  <span className="font-headline text-xl italic group-hover:translate-x-[-4px] transition-transform duration-300 inline-block">
                    {prev.title}
                  </span>
                </Link>
              ) : <div />}
              {next && (
                <Link to={`/paintings/${next.slug}`} className="group text-right">
                  <span className="font-label text-[10px] uppercase tracking-widest text-brand-muted block mb-1">Next →</span>
                  <span className="font-headline text-xl italic group-hover:translate-x-1 transition-transform duration-300 inline-block">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
