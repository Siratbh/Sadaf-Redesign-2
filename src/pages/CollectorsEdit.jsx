import { motion as Motion, AnimatePresence } from 'motion/react'
import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCollectors, getPage } from '../lib/content'
import { introComponents } from '../lib/markdownComponents'
import SEOHead from '../components/SEOHead'
import CdnImage from '../components/CdnImage'

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!items[index]) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [items, index])

  useEffect(() => {
    if (!items[index]) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext, items, index])

  const item = items[index]
  if (!item) return null

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors sm:top-6 sm:right-6"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-2 z-10 p-2 text-white/50 hover:text-white transition-colors sm:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-2 z-10 p-2 text-white/50 hover:text-white transition-colors sm:right-6"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      )}

      <Motion.div
        key={item.slug}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <CdnImage
          src={item.image}
          alt={item.title}
          w={1600}
          q={82}
          className="max-h-[75vh] w-auto object-contain select-none"
        />

        {(item.painting_title || item.caption) && (
          <div className="mt-4 text-center">
            {item.painting_title && (
              <p className="text-white font-serif text-lg sm:text-xl italic">
                {item.painting_title}
              </p>
            )}
            {item.caption && (
              <p className="text-white/50 text-xs uppercase tracking-[0.18em] font-sans mt-1">
                {item.caption}
              </p>
            )}
          </div>
        )}

        {items.length > 1 && (
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-sans mt-3">
            {index + 1} / {items.length}
          </p>
        )}
      </Motion.div>
    </Motion.div>
  )
}

export default function CollectorsEdit() {
  const collectors = getCollectors()
  const page = getPage('collectors-edit') || {}
  // Skip collector entries that have no usable image — defensive guard
  // for cases where an image gets uploaded then deleted via Decap.
  const visibleCollectors = collectors.filter((c) => c.image)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : visibleCollectors.length - 1))
  }, [visibleCollectors.length])
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev < visibleCollectors.length - 1 ? prev + 1 : 0))
  }, [visibleCollectors.length])

  return (
    <>
      <SEOHead
        title={page.seo_title || 'The Collectors Edit'}
        description={page.seo_description || ''}
      />

      <main className="bg-brand-bg min-h-screen pt-24 md:pt-32 pb-20 md:pb-32" {...(page._id ? { 'data-sb-object-id': page._id } : {})}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="mb-12 md:mb-16">
            {page.hero_eyebrow && (
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted" data-sb-field-path="hero_eyebrow">
                {page.hero_eyebrow}
              </p>
            )}
            <Motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-serif uppercase tracking-[0.1em] text-brand-ink sm:text-4xl md:text-5xl md:tracking-tight"
              data-sb-field-path="hero_title"
            >
              {page.hero_title || 'The Collectors Edit'}
            </Motion.h1>

            <div className="w-12 h-[1px] bg-brand-ink mt-4 mb-6" />

            {page.intro && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-brand-muted max-w-2xl text-sm md:text-base leading-relaxed font-light"
                data-sb-field-path="intro"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={introComponents}>
                  {page.intro}
                </ReactMarkdown>
              </Motion.div>
            )}
          </div>

          {visibleCollectors.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {visibleCollectors.map((item, idx) => (
                <Motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => openLightbox(idx)}
                  {...(item._id ? { 'data-sb-object-id': item._id } : {})}
                >
                  <div className="relative overflow-hidden bg-transparent">
                    <CdnImage
                      src={item.image}
                      alt={item.title}
                      widths={[400, 600, 900]}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      q={72}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      data-sb-field-path="image"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium">
                        {page.tile_hover_label || 'View'}
                      </span>
                    </div>
                  </div>
                  {(item.painting_title || item.caption) && (
                    <div className="mt-3">
                      {item.painting_title && (
                        <p className="text-sm font-serif italic text-brand-ink" data-sb-field-path="painting_title">
                          {item.painting_title}
                        </p>
                      )}
                      {item.caption && (
                        <p className="text-[10px] uppercase tracking-[0.18em] text-brand-muted mt-1" data-sb-field-path="caption">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  )}
                </Motion.div>
              ))}
            </div>
          ) : (
            <p className="text-brand-muted/60 italic text-center py-20" data-sb-field-path="empty_state">
              {page.empty_state || 'Collector pieces will be added soon.'}
            </p>
          )}

          <div className="mt-16">
            <Link
              to="/"
              className="inline-block border border-brand-ink text-brand-ink px-8 py-3 text-xs uppercase tracking-widest
                         hover:bg-brand-ink hover:text-white transition-colors duration-300"
              data-sb-field-path="back_button_label"
            >
              {page.back_button_label || 'Back to Home'}
            </Link>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={visibleCollectors}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  )
}
