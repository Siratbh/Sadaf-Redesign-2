import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEOHead from '../components/SEOHead'
import { getPainting, getAvailablePaintings, getPage } from '../lib/content'
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

  // Shared chrome — labels/headings used across every painting page.
  const c = getPage('painting-detail-chrome') || {}

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
          <h1 className="text-4xl font-serif italic mb-4">{c.not_found_title || 'Work not found.'}</h1>
          <Link to="/available" className="text-[11px] uppercase tracking-[0.2em] font-bold border-b border-brand-ink pb-1 text-brand-ink">
            {c.not_found_cta || '← Browse Available Works'}
          </Link>
        </div>
      </div>
    )
  }

  const isPast = painting.availability && painting.availability !== 'available'
  const backHref = isPast ? '/past-works' : '/available'
  const backLabel = isPast
    ? (c.back_to_past || '← Past Works')
    : (c.back_to_available || '← Available Works')

  const relatedPaintings = availablePaintings
    .filter((p) => p.slug !== painting.slug)
    .slice(0, 6)

  const pageDescription = painting.seo_description || painting.short_description || painting.full_description
  const pageImage = painting.featured_image || painting.thumbnail_image
  const availabilityLabel = painting.availability === 'available'
    ? (c.availability_available || 'Available')
    : (c.availability_sold || 'Sold')

  return (
    <>
      <SEOHead
        title={painting.seo_title || painting.title}
        description={pageDescription}
        image={pageImage}
      />

      <div className="min-h-screen bg-brand-bg text-brand-ink" {...(painting._id ? { 'data-sb-object-id': painting._id } : {})}>
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
                      data-sb-field-path={painting.featured_image ? 'featured_image' : 'thumbnail_image'}
                    />
                  ) : (
                    <MediaPlaceholder text={c.image_forthcoming_label || 'Image Forthcoming'} />
                  )}
                </div>
              </Motion.div>

              <div className="lg:col-span-5 flex flex-col justify-start pt-0 lg:pt-4">
                <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <h1 className="mt-3 text-4xl font-serif leading-[0.95] tracking-tight text-brand-ink sm:text-5xl md:text-6xl" data-sb-field-path="title">
                    {painting.title}
                  </h1>
                  {painting.year && (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted" data-sb-field-path="year">{painting.year}</p>
                  )}
                </Motion.div>

                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 space-y-4 border-t border-gray-100 pt-8"
                >
                  {painting.medium && (
                    <div className="flex justify-between items-baseline gap-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{c.spec_label_medium || 'Medium'}</span>
                      <span className="text-sm text-brand-ink text-right" data-sb-field-path="medium">{painting.medium}</span>
                    </div>
                  )}
                  {painting.dimensions && (
                    <div className="flex justify-between items-baseline gap-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{c.spec_label_dimensions || 'Dimensions'}</span>
                      <span className="text-sm text-brand-ink text-right" data-sb-field-path="dimensions">{painting.dimensions}</span>
                    </div>
                  )}
                  {painting.year && (
                    <div className="flex justify-between items-baseline gap-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{c.spec_label_year || 'Year'}</span>
                      <span className="text-sm text-brand-ink text-right" data-sb-field-path="year">{painting.year}</span>
                    </div>
                  )}
                  {painting.availability && (
                    <div className="flex justify-between items-baseline gap-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{c.spec_label_availability || 'Availability'}</span>
                      <span className="text-sm text-brand-ink text-right" data-sb-field-path="availability">{availabilityLabel}</span>
                    </div>
                  )}
                </Motion.div>

                {painting.short_description && (
                  <Motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="mt-8 text-sm font-light leading-relaxed text-brand-muted sm:text-[15px]" data-sb-field-path="short_description">
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
                <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">{c.artist_note_title || "Artist's Note"}</h2>
              </div>
              <div className="max-w-3xl">
                <article className="prose-editorial" data-sb-field-path="full_description">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{painting.full_description}</ReactMarkdown>
                </article>
              </div>
            </div>
          </section>
        )}

        <section className="bg-brand-bg py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
              <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">
                {painting.availability === 'sold'
                  ? (c.inquire_title_sold || 'Inquire About Similar Works')
                  : (c.inquire_title_available || 'Inquire About This Piece')}
              </h2>
            </div>

            {painting.availability === 'sold' && (
              <p className="mb-8 text-sm font-light text-brand-muted">
                {c.inquire_sold_note || 'This work is in a private collection. Inquire about similar pieces below.'}
              </p>
            )}

            {formStatus === 'success' ? (
              <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <p className="text-2xl font-serif text-brand-ink mb-2">{c.form_success_title || 'Thank you.'}</p>
                <p className="text-sm font-light text-brand-muted">{c.form_success_body || 'Your inquiry has been received. A response will follow within a few days.'}</p>
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
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted mb-2 block">{c.form_label_name || 'Name'}</label>
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
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted mb-2 block">{c.form_label_phone || 'Phone'}</label>
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
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted mb-2 block">{c.form_label_email || 'Email'}</label>
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
                    {c.form_error || 'Something went wrong. Please try again.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-brand-ink text-brand-bg py-4 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-colors disabled:opacity-50 sm:w-auto sm:px-12 sm:py-5"
                >
                  {formStatus === 'submitting'
                    ? (c.form_submitting || 'Sending…')
                    : (c.form_submit || 'Submit Inquiry')}
                </button>
              </form>
            )}
          </div>
        </section>

        {relatedPaintings.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
                <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">{c.related_title || 'You may also like'}</h2>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
                {relatedPaintings.map((art) => (
                  <Motion.div
                    key={art.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col"
                    {...(art._id ? { 'data-sb-object-id': art._id } : {})}
                  >
                    <Link to={`/paintings/${art.slug}`} className="relative aspect-[4/5] overflow-hidden bg-transparent">
                      {art.thumbnail_image || art.featured_image ? (
                        <img
                          src={art.thumbnail_image || art.featured_image}
                          alt={art.title}
                          className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          data-sb-field-path={art.thumbnail_image ? 'thumbnail_image' : 'featured_image'}
                        />
                      ) : (
                        <MediaPlaceholder text="View Work" />
                      )}
                      <div className="absolute inset-0 hidden bg-black/0 transition-colors sm:flex group-hover:bg-black/20 items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300">
                          {c.related_tile_hover || 'View this piece'}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-4 flex justify-center">
                      <Link to={`/paintings/${art.slug}`} className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors duration-300">
                        {c.related_tile_view || 'View'}
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
