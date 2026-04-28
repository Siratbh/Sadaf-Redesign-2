import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { getPaintings } from '../lib/content'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MediaPlaceholder from '../components/MediaPlaceholder'

gsap.registerPlugin(ScrollTrigger)

export default function Collections() {
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
  }, [])

  let paintings = []
  try { paintings = getPaintings() } catch (e) {}

  return (
    <>
      <SEOHead title="Collections" description="Explore Sadaf's series of original paintings." />

      {/* Hero */}
      <section className="min-h-[50vh] flex flex-col justify-end px-6 md:px-24 pt-32 pb-16 md:pb-24 bg-light-bg text-dark-text">
        <span className="font-label text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-6 block">Works</span>
        <h1 className="font-headline text-[14vw] md:text-[8vw] leading-[0.85] tracking-tighter">
          The <i>Collections</i>
        </h1>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-24 py-16 md:py-24 bg-light-bg text-dark-text min-h-screen">
        {paintings.length === 0 ? (
          <p className="font-body text-stone-500 text-sm">No paintings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {paintings.map((painting, i) => (
              <Link
                key={painting.slug}
                to={`/paintings/${painting.slug}`}
                className="group block cursor-none border-b border-stone-200 last:border-b-0 md:odd:border-r md:border-r-stone-200 reveal-item"
              >
                <div className="p-8 md:p-12 h-full flex flex-col gap-6">
                  {/* Cover image */}
                  <div className="w-full aspect-[4/3] bg-stone-200 overflow-hidden mb-4">
                    {painting.featured_image ? (
                      <img
                        src={painting.featured_image}
                        alt={painting.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <MediaPlaceholder text="View Work" />
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2 block">
                        Work {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-headline text-3xl md:text-4xl italic tracking-tight text-dark-text group-hover:translate-x-2 transition-transform duration-500 ease-out">
                        {painting.title}
                      </h2>
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-stone-500 group-hover:text-dark-text transition-colors">
                      View →
                    </span>
                  </div>

                  {painting.short_description && (
                    <p className="font-body text-sm text-stone-600 leading-relaxed max-w-sm">
                      {painting.short_description}
                    </p>
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
