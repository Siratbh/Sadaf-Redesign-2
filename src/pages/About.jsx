import { motion as Motion } from 'motion/react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import MediaPlaceholder from '../components/MediaPlaceholder'
import { getPage, getPaintings } from '../lib/content'

const splitParagraphs = (value = '') =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

function renderInlineMarkdown(text) {
  const tokens = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]

    if (token.startsWith('**')) {
      tokens.push(<strong key={`strong-${match.index}`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      tokens.push(<em key={`em-${match.index}`}>{token.slice(1, -1)}</em>)
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
      if (linkMatch) {
        tokens.push(
          <a
            key={`link-${match.index}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-brand-muted underline-offset-4 transition-colors hover:text-brand-ink"
          >
            {linkMatch[1]}
          </a>
        )
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex))
  }

  return tokens.length > 0 ? tokens : [text]
}

export default function About() {
  const a = getPage('about') || {}
  const biographyParagraphs = splitParagraphs(a.bio_body)
  const pageTitle = a.title?.trim() || 'About'
  const decorativePaintings = getPaintings().slice(0, 2)
  const leftLayer = decorativePaintings[0]?.thumbnail_image || decorativePaintings[0]?.featured_image || null
  const rightLayer = decorativePaintings[1]?.thumbnail_image || decorativePaintings[1]?.featured_image || null

  const revealUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: 'easeOut' },
  }

  return (
    <div className="bg-brand-bg text-brand-ink" {...(a._id ? { 'data-sb-object-id': a._id } : {})}>
      <SEOHead title={pageTitle} description={a.bio_intro} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-brand-bg pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-10 lg:gap-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)] lg:items-end">
              <Motion.div {...revealUp} className="max-w-3xl">
                <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted sm:mb-6">
                  About
                </span>
                <h1 className="mb-6 text-4xl font-serif leading-[0.95] tracking-tight text-brand-ink sm:text-5xl md:text-6xl lg:text-7xl">
                  About the artist
                </h1>
                <p className="max-w-2xl text-sm font-light leading-relaxed text-brand-muted sm:text-[15px] md:text-base" data-sb-field-path="bio_intro">
                  {a.bio_intro}
                </p>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="relative mx-auto w-full max-w-3xl"
              >
                <div className="relative flex min-h-[360px] items-end justify-center sm:min-h-[440px] lg:min-h-[520px]">
                  {leftLayer && (
                    <div className="absolute left-[4%] top-0 hidden w-[38%] -rotate-[3deg] overflow-hidden md:block">
                      <img
                        src={leftLayer}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full grayscale brightness-75 transition-all duration-700 hover:brightness-100"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {rightLayer && (
                    <div className="absolute right-[4%] top-[10%] hidden w-[38%] rotate-[2deg] overflow-hidden md:block">
                      <img
                        src={rightLayer}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full grayscale brightness-50 transition-all duration-700 hover:brightness-100"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="relative z-20 w-[82%] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.28)] sm:w-[64%] md:w-[48%] lg:w-[52%]">
                    {a.portrait_image ? (
                      <img
                        src={a.portrait_image}
                        alt="Sadaf Farasat portrait"
                        className="h-full w-full object-cover"
                        data-sb-field-path="portrait_image"
                      />
                    ) : (
                      <div className="aspect-[3/4] bg-transparent">
                        <MediaPlaceholder text="Portrait forthcoming" />
                      </div>
                    )}
                  </div>
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
            <Motion.h2 {...revealUp} className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">
              Biography
            </Motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            <Motion.div {...revealUp} className="md:col-span-4">
              <h3 className="text-[14px] font-black uppercase tracking-[0.1em] text-brand-ink md:text-[16px]">
                About the artist
              </h3>
            </Motion.div>

            <Motion.div {...revealUp} className="md:col-span-8">
              <div className="max-w-3xl space-y-6 text-[15px] leading-[1.8] text-brand-muted md:space-y-8 md:text-[17px]">
                {biographyParagraphs.map((para, i) => (
                  <p key={i} data-sb-field-path="bio_body">{renderInlineMarkdown(para)}</p>
                ))}
              </div>
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
                <span className="mb-8 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60 md:mb-10">
                  Artist statement
                </span>
                <blockquote className="text-3xl font-serif leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl" data-sb-field-path="artist_statement">
                  &ldquo;{a.artist_statement}&rdquo;
                </blockquote>
              </Motion.div>
            )}

            {a.studio_note && (
              <Motion.div
                {...revealUp}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className={`${a.artist_statement ? 'mt-12 border-t border-white/10 pt-8 md:mt-16 md:pt-10' : ''}`}
              >
                <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  Studio note
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
            <span className="mb-5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted md:mb-6">
              Continue
            </span>
            <h2 className="mb-6 text-3xl font-serif uppercase tracking-[0.1em] text-brand-ink sm:text-4xl md:mb-8 md:text-5xl">
              Explore further
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-sm font-light leading-relaxed text-brand-muted sm:text-[15px] md:mb-12">
              Discover the wider body of work, browse the exhibition archive, or get in touch directly.
            </p>

            <div className="flex flex-col items-center gap-6">
              <Link
                to="/contact"
                className="inline-block w-full bg-brand-ink px-8 py-4 text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bg transition-all duration-300 hover:bg-brand-accent sm:w-auto sm:px-12 sm:py-5"
              >
                Get in touch
              </Link>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                <Link to="/available" className="border-b border-brand-ink pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-ink">
                  View available works
                </Link>
                <Link to="/exhibitions" className="border-b border-brand-ink pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-ink">
                  View exhibitions
                </Link>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>
    </div>
  )
}
