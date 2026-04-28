import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { getCollection, getPaintingsByCollection } from '../lib/content'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MediaPlaceholder from '../components/MediaPlaceholder'

gsap.registerPlugin(ScrollTrigger)

export default function CollectionDetail() {
  const { slug } = useParams()

  let collection = null
  let paintings = []
  try {
    collection = getCollection(slug)
    paintings = getPaintingsByCollection(slug)
  } catch (e) {}

  useEffect(() => {
    document.body.classList.add('is-light')
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
    return () => { ctx.revert(); document.body.classList.remove('is-light') }
  }, [slug])

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg text-dark-text px-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl italic mb-4">Collection not found.</h1>
          <Link to="/collections" className="font-label text-[10px] uppercase tracking-widest border-b border-stone-400 pb-1 cursor-none">
            ← Back to Collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={collection.seo_title || collection.title}
        description={collection.seo_description || collection.intro}
      />

      {/* Hero */}
      <section className="min-h-[60vh] flex flex-col justify-end px-6 md:px-24 pt-32 pb-16 md:pb-24 bg-light-bg text-dark-text overflow-hidden">
        {collection.cover_image && (
          <div className="absolute inset-0 z-0">
            <img
              src={collection.cover_image}
              alt={collection.title}
              className="w-full h-full object-cover opacity-10"
            />
          </div>
        )}
        <div className="relative z-10">
          <Link
            to="/collections"
            className="font-label text-[10px] uppercase tracking-widest text-stone-500 mb-8 block hover:text-dark-text transition-colors cursor-none"
          >
            ← Collections
          </Link>
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-4 block">Series</span>
          <h1 className="font-headline text-[14vw] md:text-[8vw] leading-[0.85] tracking-tighter">
            <i>{collection.title}</i>
          </h1>
        </div>
      </section>

      {/* Series note */}
      {(collection.intro || collection.series_note) && (
        <section className="px-6 md:px-24 py-16 md:py-24 bg-light-bg text-dark-text border-t border-stone-200">
          <div className="max-w-2xl">
            {collection.intro && (
              <p className="font-body text-xl md:text-2xl leading-relaxed text-stone-700 mb-8 reveal-item">
                {collection.intro}
              </p>
            )}
            {collection.series_note && (
              <p className="font-body text-sm text-stone-500 leading-relaxed reveal-item">
                {collection.series_note}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Paintings grid */}
      <section className="px-6 md:px-24 py-16 md:py-24 bg-light-bg text-dark-text">
        {paintings.length === 0 ? (
          <p className="font-body text-stone-500 text-sm">No paintings in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {paintings.map((painting) => (
              <Link
                key={painting.slug}
                to={`/paintings/${painting.slug}`}
                className="group block cursor-none reveal-item"
              >
                <div className="w-full aspect-[3/4] bg-stone-200 overflow-hidden mb-6">
                  {painting.featured_image ? (
                    <img
                      src={painting.featured_image}
                      alt={painting.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <MediaPlaceholder text="Work details" />
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline text-xl italic tracking-tight mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {painting.title}
                    </h3>
                    <p className="font-label text-[10px] uppercase tracking-widest text-stone-500">
                      {painting.medium} — {painting.year}
                    </p>
                  </div>
                  {painting.availability === 'available' && (
                    <span className="font-label text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                      Available
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
