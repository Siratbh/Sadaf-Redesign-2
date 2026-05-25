import { Link } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import SEOHead from '../components/SEOHead'
import MediaPlaceholder from '../components/MediaPlaceholder'
import { getExhibitions, getPage } from '../lib/content'
import { pickFeatured, cardImage, formatDateRange } from '../lib/exhibitions'

function hasDetailContent(ex) {
  return Boolean(
    ex.body ||
    ex.hero_image ||
    ex.hero_video ||
    ex.card_thumbnail ||
    (Array.isArray(ex.gallery) && ex.gallery.some(g => g && (g.image || g.video)))
  )
}

function MetaLine({ ex }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">
      <span data-sb-field-path="venue">{ex.venue}</span>
      {ex.city ? <>, <span data-sb-field-path="city">{ex.city}</span></> : ''}
    </p>
  )
}

function HeroFeatured({ ex, labels }) {
  if (!ex) return null
  const linked = hasDetailContent(ex)
  const img = cardImage(ex)
  const dateLabel = formatDateRange(ex.start_date, ex.end_date, ex.year)
  const Wrapper = linked ? Link : 'div'
  const wrapperProps = linked ? { to: `/exhibitions/${ex.slug}` } : {}

  return (
    <section className="border-b border-gray-100" {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}>
      <Wrapper
        {...wrapperProps}
        className="group block max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative w-full aspect-[4/3] md:aspect-[5/4] overflow-hidden bg-gray-100">
              {img ? (
                <img
                  src={img}
                  alt={ex.title}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  loading="eager"
                  data-sb-field-path={ex.hero_image ? 'hero_image' : (ex.card_thumbnail ? 'card_thumbnail' : 'image')}
                />
              ) : (
                <MediaPlaceholder text={ex.title} />
              )}
              {ex.exhibition_type && (
                <span className="absolute top-4 left-4 bg-brand-bg/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-ink" data-sb-field-path="exhibition_type">
                  {ex.exhibition_type}
                </span>
              )}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            {dateLabel && (
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-muted">
                {dateLabel}
              </p>
            )}
            <h2 className="font-serif italic text-brand-ink leading-[1.02] text-4xl sm:text-5xl md:text-6xl lg:text-[64px]" data-sb-field-path="title">
              {ex.title}
            </h2>
            <div className="mt-6 md:mt-8 space-y-2">
              <MetaLine ex={ex} />
              {ex.description && (
                <p className="pt-4 max-w-md text-[14px] md:text-[15px] leading-[1.7] font-light text-brand-muted" data-sb-field-path="description">
                  {ex.description}
                </p>
              )}
            </div>
            {linked && (
              <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-ink border-b border-brand-ink pb-1 group-hover:text-brand-accent group-hover:border-brand-accent transition-colors">
                {labels.viewExhibition}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            )}
          </Motion.div>
        </div>
      </Wrapper>
    </section>
  )
}

function NextFeatured({ ex, labels }) {
  if (!ex) return null
  const linked = hasDetailContent(ex)
  const img = cardImage(ex)
  const dateLabel = formatDateRange(ex.start_date, ex.end_date, ex.year)
  const Wrapper = linked ? Link : 'div'
  const wrapperProps = linked ? { to: `/exhibitions/${ex.slug}` } : {}

  return (
    <section className="border-b border-gray-100 bg-brand-bg" {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}>
      <Wrapper {...wrapperProps} className="group block">
        <div className="relative w-full overflow-hidden bg-gray-100">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[78vh]">
            {img ? (
              <img
                src={img}
                alt={ex.title}
                className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02]"
                loading="lazy"
                data-sb-field-path={ex.hero_image ? 'hero_image' : (ex.card_thumbnail ? 'card_thumbnail' : 'image')}
              />
            ) : (
              <MediaPlaceholder text={ex.title} />
            )}
            <span className="absolute top-5 left-5 md:top-7 md:left-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-bg/95 bg-brand-ink/40 backdrop-blur-sm px-3 py-1.5">
              {labels.nextBadge}
            </span>
          </div>
        </div>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
            <div className="md:col-span-3 lg:col-span-4">
              {dateLabel && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-muted">
                  {dateLabel}
                </p>
              )}
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-ink" data-sb-field-path={ex.exhibition_type ? 'exhibition_type' : undefined}>
                {ex.exhibition_type || labels.exhibitionTypeFallback}
              </p>
            </div>
            <div className="md:col-span-9 lg:col-span-8">
              <h2 className="font-serif italic text-brand-ink leading-[0.95] uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[96px] xl:text-[112px] tracking-tight" data-sb-field-path="title">
                {ex.title}
              </h2>
              <div className="mt-5 md:mt-7 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
                <MetaLine ex={ex} />
                {linked && (
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-ink border-b border-brand-ink pb-1 group-hover:text-brand-accent group-hover:border-brand-accent transition-colors">
                    {labels.viewExhibition}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Motion.div>
      </Wrapper>
    </section>
  )
}

function ArchiveCard({ ex }) {
  const linked = hasDetailContent(ex)
  const img = cardImage(ex)
  const dateLabel = formatDateRange(ex.start_date, ex.end_date, ex.year)
  const Wrapper = linked ? Link : 'div'
  const wrapperProps = linked ? { to: `/exhibitions/${ex.slug}` } : {}

  return (
    <div className="group flex flex-col" {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}>
      <Wrapper {...wrapperProps} className="block">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
          {img ? (
            <img
              src={img}
              alt={ex.title}
              className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              loading="lazy"
              data-sb-field-path={ex.card_thumbnail ? 'card_thumbnail' : (ex.hero_image ? 'hero_image' : 'image')}
            />
          ) : (
            <MediaPlaceholder text={ex.title} />
          )}
          {ex.exhibition_type && (
            <span className="absolute top-3 left-3 bg-brand-bg/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-ink" data-sb-field-path="exhibition_type">
              {ex.exhibition_type}
            </span>
          )}
          {linked && (
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-brand-bg bg-brand-ink/80 backdrop-blur-sm w-9 h-9 flex items-center justify-center text-sm"
            >
              →
            </span>
          )}
        </div>

        <div className="mt-4 md:mt-5">
          <h3 className="font-serif italic text-brand-ink text-xl md:text-2xl leading-[1.15] group-hover:text-brand-accent transition-colors" data-sb-field-path="title">
            {ex.title}
          </h3>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-muted">
            <span data-sb-field-path="venue">{ex.venue}</span>
            {ex.city ? <> · <span data-sb-field-path="city">{ex.city}</span></> : ''}
          </p>
          {dateLabel && (
            <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-brand-muted/80">
              {dateLabel}
            </p>
          )}
        </div>
      </Wrapper>
    </div>
  )
}

function YearSection({ year, items, countSingular, countPlural }) {
  return (
    <div className="mb-20 md:mb-28 last:mb-0">
      <div className="flex items-baseline gap-6 md:gap-10 mb-8 md:mb-12">
        <h2 className="font-serif italic text-brand-ink text-4xl md:text-5xl lg:text-6xl leading-none">
          {year}
        </h2>
        <span className="flex-1 h-px bg-gray-200" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">
          {items.length} {items.length === 1 ? countSingular : countPlural}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
        {items.map((ex) => <ArchiveCard key={ex.slug} ex={ex} />)}
      </div>
    </div>
  )
}

export default function Exhibitions() {
  let exhibitions = []
  try {
    exhibitions = getExhibitions()
  } catch {
    // ignore
  }

  const p = getPage('exhibitions') || {}
  const labels = {
    viewExhibition: p.view_exhibition_label || 'View exhibition',
    nextBadge: p.next_badge_label || 'Next',
    exhibitionTypeFallback: p.exhibition_type_fallback || 'Exhibition',
  }
  const countSingular = p.count_singular || 'exhibition'
  const countPlural = p.count_plural || 'exhibitions'

  // Sort: most recent year first, then by sort_order ascending within each year
  const sorted = [...exhibitions].sort((a, b) => {
    const ay = parseInt(a.year, 10) || 0
    const by = parseInt(b.year, 10) || 0
    if (by !== ay) return by - ay
    return (a.sort_order ?? 99) - (b.sort_order ?? 99)
  })

  const featured = pickFeatured(sorted, 2)
  const featuredSlugs = new Set(featured.map(ex => ex.slug))
  const rest = sorted.filter(ex => !featuredSlugs.has(ex.slug))

  // Year-group what's left over for the archive grid
  const byYear = rest.reduce((acc, ex) => {
    const y = ex.year || 'Undated'
    if (!acc[y]) acc[y] = []
    acc[y].push(ex)
    return acc
  }, {})
  const years = Object.keys(byYear).sort((a, b) => {
    if (a === 'Undated') return 1
    if (b === 'Undated') return -1
    return parseInt(b, 10) - parseInt(a, 10)
  })

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink" {...(p._id ? { 'data-sb-object-id': p._id } : {})}>
      <SEOHead
        title={p.seo_title || 'Exhibitions'}
        description={p.seo_description || 'A complete archive of solo and group exhibitions.'}
      />

      {/* Page header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-12 md:pt-32 md:pb-16">
        <Motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted mb-6"
          data-sb-field-path="hero_eyebrow"
        >
          {p.hero_eyebrow || 'Archive'}
        </Motion.span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-brand-ink text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight"
          >
            <span data-sb-field-path="hero_title_prefix">{p.hero_title_prefix || 'The '}</span>
            <i className="font-serif italic" data-sb-field-path="hero_title_italic">{p.hero_title_italic || 'Archive'}</i>
          </Motion.h1>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-right md:pb-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted">
              {exhibitions.length} {exhibitions.length === 1 ? countSingular : countPlural}
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Hero featured */}
      {featured[0] && <HeroFeatured ex={featured[0]} labels={labels} />}

      {/* NEXT featured */}
      {featured[1] && <NextFeatured ex={featured[1]} labels={labels} />}

      {/* Archive grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted mb-3" data-sb-field-path="archive_section_label">
            {p.archive_section_label || 'Exhibition Archive'}
          </p>
          <p className="font-serif italic text-brand-ink text-2xl md:text-3xl lg:text-4xl leading-[1.15] max-w-2xl" data-sb-field-path="archive_section_intro">
            {p.archive_section_intro || 'Every show, residency, and fair — from the earliest to the most recent.'}
          </p>
        </div>

        {years.length === 0 ? (
          <p className="text-brand-muted text-sm pt-8" data-sb-field-path="empty_state">
            {p.empty_state || 'No exhibitions yet. Add them through the CMS.'}
          </p>
        ) : (
          years.map((year) => (
            <YearSection key={year} year={year} items={byYear[year]} countSingular={countSingular} countPlural={countPlural} />
          ))
        )}
      </section>
    </div>
  )
}
