import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MediaPlaceholder from '../components/MediaPlaceholder'
import { getPage } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
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

  const a = getPage('about') || {}

  return (
    <>
      <SEOHead title="About" description={a.bio_intro} />

      {/* Hero */}
      <section className="min-h-[50vh] flex flex-col justify-end px-6 md:px-24 pt-32 pb-16 md:pb-24 bg-light-bg text-dark-text">
        <span className="font-label text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-6 block">Monograph</span>
        <h1 className="font-headline text-[14vw] md:text-[8vw] leading-[0.85] tracking-tighter">
          The <i>Artist</i>
        </h1>
      </section>

      {/* Portrait + intro */}
      <section className="px-6 md:px-24 py-16 md:py-24 bg-light-bg text-dark-text">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5 reveal-item">
            <div className="w-full aspect-[3/4] bg-stone-200 overflow-hidden">
              {a.portrait_image ? (
                <img src={a.portrait_image} alt="Artist portrait" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <MediaPlaceholder text="Portrait Forthcoming" />
              )}
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center gap-10">
            <p className="font-label text-[10px] md:text-sm uppercase tracking-[0.25em] leading-loose text-stone-500 reveal-item">
              {a.bio_intro}
            </p>
            {a.bio_body?.split('\n\n').map((para, i) => (
              <p key={i} className="font-body text-base md:text-xl text-stone-800 leading-relaxed reveal-item">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Artist statement */}
      {a.artist_statement && (
        <section className="px-6 md:px-24 py-16 md:py-32 bg-light-bg text-dark-text border-t border-stone-200">
          <div className="max-w-4xl mx-auto text-center reveal-item">
            <span className="font-label text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-10 block">Artist Statement</span>
            <blockquote className="font-headline text-[6vw] md:text-[4vw] leading-[1.1] tracking-tight italic text-dark-text">
              &ldquo;{a.artist_statement}&rdquo;
            </blockquote>
          </div>
        </section>
      )}

      {/* Studio note */}
      {a.studio_note && (
        <section className="px-6 md:px-24 py-12 bg-light-bg text-dark-text border-t border-stone-200">
          <p className="font-label text-[10px] uppercase tracking-widest text-stone-500 text-center">
            {a.studio_note}
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 md:px-24 py-16 bg-light-bg text-dark-text border-t border-stone-200">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 reveal-item">
          <Link to="/collections" className="font-label text-[10px] uppercase tracking-[0.3em] border-b border-stone-400 pb-2 hover:border-dark-text transition-colors cursor-none">
            View Collections →
          </Link>
          <Link to="/exhibitions" className="font-label text-[10px] uppercase tracking-[0.3em] border-b border-stone-400 pb-2 hover:border-dark-text transition-colors cursor-none">
            Exhibition History →
          </Link>
          <Link to="/contact" className="font-label text-[10px] uppercase tracking-[0.3em] border-b border-stone-400 pb-2 hover:border-dark-text transition-colors cursor-none">
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  )
}
