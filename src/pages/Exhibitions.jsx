import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import SEOHead from '../components/SEOHead'
import Lightbox from '../components/Lightbox'
import CdnImage from '../components/CdnImage'
import { getExhibitions, getPage, getExhibitionGallery } from '../lib/content'
import { formatDateRange } from '../lib/exhibitions'

// An exhibition has "detail content" worth linking to when it carries written
// content or an external press link. Media is now managed independently via
// the Exhibition Gallery collection, so image presence no longer drives linking.
function hasDetailContent(ex) {
  return Boolean(ex.body || ex.description || ex.link)
}

// One exhibition as a typographic row. No image — the visuals live in the pool
// above; this list is the organised, complete history.
function HistoryRow({ ex }) {
  const linked = hasDetailContent(ex)
  const dateLabel = formatDateRange(ex.start_date, ex.end_date, ex.year)
  const Wrapper = linked ? Link : 'div'
  const wrapperProps = linked ? { to: `/exhibitions/${ex.slug}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-7 ${linked ? 'cursor-pointer' : ''}`}
      {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}
    >
      <div className="md:flex-1">
        <h3
          className={`font-serif italic text-brand-ink text-2xl leading-[1.1] md:text-3xl ${linked ? 'transition-colors group-hover:text-brand-accent' : ''}`}
          data-sb-field-path="title"
        >
          {ex.title}
        </h3>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-muted">
          <span data-sb-field-path="venue">{ex.venue}</span>
          {ex.city ? <> · <span data-sb-field-path="city">{ex.city}</span></> : ''}
          {ex.exhibition_type ? <> · <span data-sb-field-path="exhibition_type">{ex.exhibition_type}</span></> : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4 md:justify-end md:text-right">
        {dateLabel && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-muted">
            {dateLabel}
          </span>
        )}
        {linked && (
          <span aria-hidden="true" className="text-brand-ink transition-transform group-hover:translate-x-1">→</span>
        )}
      </div>
    </Wrapper>
  )
}

function YearGroup({ year, items, countSingular, countPlural }) {
  return (
    <div className="mb-14 last:mb-0 md:mb-20">
      <div className="mb-2 flex items-baseline gap-6 md:mb-4 md:gap-10">
        <h2 className="font-serif italic text-brand-ink text-3xl leading-none md:text-4xl lg:text-5xl">
          {year}
        </h2>
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted">
          {items.length} {items.length === 1 ? countSingular : countPlural}
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((ex) => <HistoryRow key={ex.slug} ex={ex} />)}
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
  const countSingular = p.count_singular || 'exhibition'
  const countPlural = p.count_plural || 'exhibitions'

  const [lbOpen, setLbOpen] = useState(false)
  const [lbIndex, setLbIndex] = useState(0)
  const openLightbox = (idx) => { setLbIndex(idx); setLbOpen(true) }

  // Sort: most recent year first, then by sort_order ascending within each year.
  const sorted = [...exhibitions].sort((a, b) => {
    const ay = parseInt(a.year, 10) || 0
    const by = parseInt(b.year, 10) || 0
    if (by !== ay) return by - ay
    return (a.sort_order ?? 99) - (b.sort_order ?? 99)
  })

  // Standalone gallery — managed via the Exhibition Gallery CMS collection,
  // independent of individual exhibition entries.
  const gallery = getExhibitionGallery()
  const pool = gallery.map(item => ({
    src: item.video || item.image,
    type: item.video ? 'video' : 'image',
    caption: item.caption || '',
    slug: item._id,
    objectId: item._id,
    fieldPath: item.video ? 'video' : 'image',
  }))

  // Year-group ALL exhibitions for the complete text history.
  const byYear = sorted.reduce((acc, ex) => {
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-10 md:pt-32 md:pb-14">
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

      {/* Image pool — masonry of every exhibition photo, opens the lightbox */}
      {pool.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
          <div className="mb-8 md:mb-12">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted" data-sb-field-path="pool_section_label">
              {p.pool_section_label || 'Moments'}
            </p>
            <p className="font-serif italic text-brand-ink text-2xl leading-[1.15] max-w-2xl md:text-3xl lg:text-4xl" data-sb-field-path="pool_section_intro">
              {p.pool_section_intro || 'Glimpses from the shows — openings, installations, and walls.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {pool.map((item, idx) => (
              <Motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group cursor-pointer overflow-hidden"
                onClick={() => openLightbox(idx)}
                {...(item.objectId ? { 'data-sb-object-id': item.objectId } : {})}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-muted/10">
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      {...(item.fieldPath ? { 'data-sb-field-path': item.fieldPath } : {})}
                    />
                  ) : (
                    <CdnImage
                      src={item.src}
                      alt={item.caption}
                      widths={[400, 600, 900]}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      q={72}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      {...(item.fieldPath ? { 'data-sb-field-path': item.fieldPath } : {})}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                    <span className="px-6 py-3 bg-white text-brand-ink text-[11px] font-medium uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      View
                    </span>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Exhibition history — the complete, organised text record */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-gray-100 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mb-10 md:mb-14">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted" data-sb-field-path="archive_section_label">
            {p.archive_section_label || 'Exhibition History'}
          </p>
          <p className="font-serif italic text-brand-ink text-2xl leading-[1.15] max-w-2xl md:text-3xl lg:text-4xl" data-sb-field-path="archive_section_intro">
            {p.archive_section_intro || 'Every show, residency, and fair — from the most recent to the earliest.'}
          </p>
        </div>

        {years.length === 0 ? (
          <p className="text-brand-muted text-sm pt-8" data-sb-field-path="empty_state">
            {p.empty_state || 'No exhibitions yet. Add them through the CMS.'}
          </p>
        ) : (
          years.map((year) => (
            <YearGroup
              key={year}
              year={year}
              items={byYear[year]}
              countSingular={countSingular}
              countPlural={countPlural}
            />
          ))
        )}
      </section>

      <Lightbox
        images={pool}
        startIndex={lbIndex}
        open={lbOpen}
        onClose={() => setLbOpen(false)}
        onIndexChange={setLbIndex}
      />
    </div>
  )
}
