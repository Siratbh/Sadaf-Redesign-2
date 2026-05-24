import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import SEOHead from '../components/SEOHead'
import { getPainting, getAvailablePaintings } from '../lib/content'
import MediaPlaceholder from '../components/MediaPlaceholder'

export default function PaintingDetail() {
  const { slug } = useParams()
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [formStatus, setFormStatus] = useState('idle')

  let painting = null
  let availablePaintings = []

  try {
    painting = getPainting(slug)
    availablePaintings = getAvailablePaintings()
  } catch {
    painting = null
    availablePaintings = []
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!painting) return

    setFormStatus('submitting')

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'inquiry',
          ...formData,
          painting: painting.title,
        }).toString(),
      })

      if (res.ok) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  if (!painting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-ink px-4">
        <div className="text-center">
          <h1 className="text-4xl font-serif italic mb-4">Work not found.</h1>
          <Link to="/available" className="text-[11px] uppercase tracking-[0.2em] font-bold border-b border-brand-ink pb-1 text-brand-ink">
            ← Browse Available Works
          </Link>
        </div>
      </div>
    )
  }

  const isPast = painting.availability && painting.availability !== 'available'
  const backHref = isPast ? '/past-works' : '/available'
  const backLabel = isPast ? '← Past Works' : '← Available Works'

  const relatedPaintings = availablePaintings
    .filter((p) => p.slug !== painting.slug)
    .slice(0, 6)

  const pageDescription = painting.seo_description || painting.short_description || painting.full_description
  const pageImage = painting.featured_image || painting.thumbnail_image

  return (
    <>
      <SEOHead
        title={painting.seo_title || painting.title}
        description={pageDescription}
        image={pageImage}
      />

      <div className="min-h-screen bg-brand-bg text-brand-ink">
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-4 sm:px-6 md:pt-32 md:pb-6">
          <Link to={backHref} className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted hover:text-brand-ink transition-colors">
            {backLabel}
          </Link>
        </div>

        <section className="bg-brand-bg pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <Motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="lg:col-span-7"
              >
                <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                  {painting.featured_image || painting.thumbnail_image ? (
                    <img
                      src={painting.featured_image || painting.thumbnail_image}
                      alt={painting.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <MediaPlaceholder text="Image Forthcoming" />
                  )}
                </div>
              </Motion.div>

              <div className="lg:col-span-5 flex flex-col justify-start pt-0 lg:pt-4">
                <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <h1 className="mt-3 text-4xl font-serif leading-[0.95] tracking-tight text-brand-ink sm:text-5xl md:text-6xl">
                    {painting.title}
                  </h1>
                  {painting.year && (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{painting.year}</p>
                  )}
                </Motion.div>

                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 space-y-4 border-t border-gray-100 pt-8"
                >
                  {[
                    { label: 'Medium', value: painting.medium },
                    { label: 'Dimensions', value: painting.dimensions },
                    { label: 'Year', value: painting.year },
                    {
                      label: 'Availability',
                      value: painting.availability === 'available' ? 'Available' : 'Sold',
                    },
                  ].filter((row) => row.value).map((row) => (
                    <div key={row.label} className="flex justify-between items-baseline gap-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{row.label}</span>
                      <span className="text-sm text-brand-ink text-right">{row.value}</span>
                    </div>
                  ))}
                </Motion.div>

                {painting.short_description && (
                  <Motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="mt-8 text-sm font-light leading-relaxed text-brand-muted sm:text-[15px]">
                      {painting.short_description}
                    </p>
                  </Motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {painting.full_description && (
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
                <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">Artist&apos;s Note</h2>
              </div>
              <div className="max-w-3xl text-[15px] leading-[1.8] text-brand-muted md:text-[17px] whitespace-pre-line">
                {painting.full_description}
              </div>
            </div>
          </section>
        )}

        <section className="bg-brand-bg py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
              <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">
                {painting.availability === 'sold' ? 'Inquire About Similar Works' : 'Inquire About This Piece'}
              </h2>
            </div>

            {painting.availability === 'sold' && (
              <p className="mb-8 text-sm font-light text-brand-muted">This work is in a private collection. Inquire about similar pieces below.</p>
            )}

            {formStatus === 'success' ? (
              <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <p className="text-2xl font-serif text-brand-ink mb-2">Thank you.</p>
                <p className="text-sm font-light text-brand-muted">Your inquiry has been received. A response will follow within a few days.</p>
              </Motion.div>
            ) : (
              <form
                name="inquiry"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleFormSubmit}
                className="max-w-xl space-y-8"
              >
                <input type="hidden" name="form-name" value="inquiry" />
                <input type="hidden" name="bot-field" />
                <input type="hidden" name="painting" value={painting.title} />

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted mb-2 block">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-brand-ink py-3 px-0 text-brand-ink outline-none transition-colors text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted mb-2 block">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-brand-ink py-3 px-0 text-brand-ink outline-none transition-colors text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted mb-2 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-brand-ink py-3 px-0 text-brand-ink outline-none transition-colors text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>

                {formStatus === 'error' && (
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-red-500">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-brand-ink text-brand-bg py-4 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-colors disabled:opacity-50 sm:w-auto sm:px-12 sm:py-5"
                >
                  {formStatus === 'submitting' ? 'Sending…' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </section>

        {relatedPaintings.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
                <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">You may also like</h2>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
                {relatedPaintings.map((art) => (
                  <Motion.div
                    key={art.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col"
                  >
                    <Link to={`/paintings/${art.slug}`} className="relative aspect-[4/5] overflow-hidden bg-transparent">
                      {art.thumbnail_image || art.featured_image ? (
                        <img
                          src={art.thumbnail_image || art.featured_image}
                          alt={art.title}
                          className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />                      ) : (
                        <MediaPlaceholder text="View Work" />
                      )}
                      <div className="absolute inset-0 hidden bg-black/0 transition-colors sm:flex group-hover:bg-black/20 items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300">
                          View this piece
                        </span>
                      </div>
                    </Link>

                    <div className="mt-4 flex justify-center">
                      <Link to={`/paintings/${art.slug}`} className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors duration-300">
                        View
                      </Link>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
