import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion as Motion } from 'motion/react'
import { mediaType, youtubeEmbedUrl, vimeoEmbedUrl } from '../lib/media'
import CdnImage from './CdnImage'

export default function Lightbox({ images, startIndex, open, onClose, onIndexChange }) {
  const total = images.length
  const current = images[startIndex]
  const currentType = current ? (current.type || mediaType(current.src)) : 'image'

  const goPrev = useCallback(() => {
    if (total <= 1) return
    onIndexChange((startIndex - 1 + total) % total)
  }, [startIndex, total, onIndexChange])

  const goNext = useCallback(() => {
    if (total <= 1) return
    onIndexChange((startIndex + 1) % total)
  }, [startIndex, total, onIndexChange])

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, goPrev, goNext])

  return (
    <AnimatePresence>
      {open && current && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 md:top-7 md:right-7 text-white/80 hover:text-white text-2xl leading-none w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Previous image"
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl w-12 h-12 flex items-center justify-center"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Next image"
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl w-12 h-12 flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}

          <Motion.div
            key={current.src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center"
          >
            {currentType === 'image' && (
              <CdnImage
                src={current.src}
                alt={current.caption || ''}
                w={1600}
                q={82}
                className="max-w-[92vw] max-h-[82vh] object-contain"
              />
            )}
            {currentType === 'video' && (
              <video
                src={current.src}
                controls
                playsInline
                preload="metadata"
                className="max-w-[92vw] max-h-[82vh] object-contain bg-black"
              />
            )}
            {currentType === 'youtube' && (
              <iframe
                src={youtubeEmbedUrl(current.src)}
                title={current.caption || 'YouTube video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-[92vw] max-w-[1200px] aspect-video bg-black"
              />
            )}
            {currentType === 'vimeo' && (
              <iframe
                src={vimeoEmbedUrl(current.src)}
                title={current.caption || 'Vimeo video'}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-[92vw] max-w-[1200px] aspect-video bg-black"
              />
            )}
          </Motion.div>

          {(current.caption || total > 1) && (
            <div className="mt-6 px-6 text-center text-white/70 text-xs tracking-wider">
              {current.caption && <p className="mb-1">{current.caption}</p>}
              {total > 1 && (
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
                  {startIndex + 1} / {total}
                </p>
              )}
            </div>
          )}
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
