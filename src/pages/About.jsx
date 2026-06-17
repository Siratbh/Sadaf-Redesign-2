import { motion as Motion } from 'motion/react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEOHead from '../components/SEOHead'
import CdnImage from '../components/CdnImage'
import MediaPlaceholder from '../components/MediaPlaceholder'
import { getPage } from '../lib/content'
import { introComponents } from '../lib/markdownComponents'

// Used for the artist_statement styled blockquote — restricted to inline-only
// elements because the surrounding <blockquote> has hard-coded huge serif
// styling that breaks if the editor adds lists/headings inside it.
const INLINE_ELEMENTS = ['strong', 'em', 'a']

export default function About() {
  const a = getPage('about') || {}
  const pageTitle = a.title?.trim() || 'About'

  const revealUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: 'easeOut' },
  }

  return (
    <div className="bg-brand-bg text-brand-ink" {...(a._id ? { 'data-sb-object-id': a._id } : {})}>
      <SEOHead title={a.seo_title || pageTitle} description={a.seo_description || a.bio_intro} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-brand-bg pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-10 lg:gap-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)] lg:items-end">
              <Motion.div {...revealUp} className="max-w-3xl">
                <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted sm:mb-6" data-sb-field-path="hero_eyebrow">
                  {a.hero_eyebrow || 'About'}
                </span>
                <h1 className="mb-6 text-4xl font-serif leading-[0.95] tracking-tight text-brand-ink sm:text-5xl md:text-6xl lg:text-7xl" data-sb-field-path="hero_title">
                  {a.hero_title || 'About the artist'}
                </h1>
                <div className="max-w-2xl text-sm font-light leading-relaxed text-brand-muted sm:text-[15px] md:text-base" data-sb-field-path="bio_intro">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={introComponents}>
                    {a.bio_intro || ''}
                  </ReactMarkdown>
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto lg:max-w-md"
              >
                <div className="relative overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.28)]">
                  {a.portrait_image ? (
                    <CdnImage
                      src={a.portrait_image}
                      alt="Sadaf Farasat portrait"
                      widths={[360, 540, 800, 1020]}
                      sizes="(max-width: 1024px) 90vw, 460px"
                      q={78}
                      width="1020"
                      height="1657"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="aspect-[1020/1657] w-full object-cover grayscale"
                      data-sb-field-path="portrait_image"
                    />
                  ) : (
                    <div className="aspect-[1020/1657] bg-transparent">
                      <MediaPlaceholder text="Portrait forthcoming" />
                    </div>
                  )}
                </div>
              </Motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
            <Motion.h2 {...revealUp} className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl" data-sb-field-path="biography_title">
              {a.biography_title || 'Biography'}
            </Motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            <Motion.div {...revealUp} className="md:col-span-4">
              <h3 className="text-[14px] font-black uppercase tracking-[0.1em] text-brand-ink md:text-[16px]" data-sb-field-path="biography_subhead">
                {a.biography_subhead || 'About the artist'}
              </h3>
            </Motion.div>

            <Motion.div {...revealUp} className="md:col-span-8">
              <article className="prose-editorial max-w-3xl" data-sb-field-path="bio_body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{a.bio_body || ''}</ReactMarkdown>
              </article>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Artist statement */}
      {(a.artist_statement || a.studio_note) && (
        <section className="bg-black py-20 text-white md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {a.artist_statement && (
              <Motion.div {...revealUp} className="max-w-5xl">
                <span className="mb-8 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60 md:mb-10" data-sb-field-path="statement_label">
                  {a.statement_label || 'Artist statement'}
                </span>
                <blockquote className="text-3xl font-serif leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl" data-sb-field-path="artist_statement">
                  &ldquo;
                  <ReactMarkdown remarkPlugins={[remarkGfm]} allowedElements={INLINE_ELEMENTS} unwrapDisallowed>
                    {a.artist_statement}
                  </ReactMarkdown>
                  &rdquo;
                </blockquote>
              </Motion.div>
            )}

            {a.studio_note && (
              <Motion.div
                {...revealUp}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className={`${a.artist_statement ? 'mt-12 border-t border-white/10 pt-8 md:mt-16 md:pt-10' : ''}`}
              >
                <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45" data-sb-field-path="studio_label">
                  {a.studio_label || 'Studio note'}
                </span>
                <p className="max-w-3xl text-sm leading-relaxed text-white/68 sm:text-[15px]" data-sb-field-path="studio_note">
                  {a.studio_note}
                </p>
              </Motion.div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-100 bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Motion.div {...revealUp} className="mx-auto max-w-3xl text-center">
            <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted md:mb-6" data-sb-field-path="cta_eyebrow">
              {a.cta_eyebrow || 'Continue'}
            </span>
            <h2 className="mb-6 text-3xl font-serif uppercase tracking-[0.1em] text-brand-ink sm:text-4xl md:mb-8 md:text-5xl" data-sb-field-path="cta_title">
              {a.cta_title || 'Explore further'}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-sm font-light leading-relaxed text-brand-muted sm:text-[15px] md:mb-12" data-sb-field-path="cta_body">
              {a.cta_body || 'Discover the wider body of work, browse the exhibition archive, or get in touch directly.'}
            </p>

            <div className="flex flex-col items-center gap-6">
              <Link
                to="/contact"
                className="inline-block w-full bg-brand-ink px-8 py-4 text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bg transition-all duration-300 hover:bg-brand-accent sm:w-auto sm:px-12 sm:py-5"
                data-sb-field-path="cta_contact_button"
              >
                {a.cta_contact_button || 'Get in touch'}
              </Link>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                <Link to="/available" className="border-b border-brand-ink pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-ink" data-sb-field-path="cta_available_link">
                  {a.cta_available_link || 'View available works'}
                </Link>
                <Link to="/exhibitions" className="border-b border-brand-ink pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-ink" data-sb-field-path="cta_exhibitions_link">
                  {a.cta_exhibitions_link || 'View exhibitions'}
                </Link>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>
    </div>
  )
}
