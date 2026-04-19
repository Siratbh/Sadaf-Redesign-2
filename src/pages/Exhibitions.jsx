import { useEffect, useRef } from 'react'
import SEOHead from '../components/SEOHead'
import { getExhibitions } from '../lib/content'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FALLBACK_HOVERS = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80'
]

export default function Exhibitions() {
  const revealRef = useRef(null)
  const revealInnerRef = useRef(null)

  let exhibitions = []
  try { exhibitions = getExhibitions() } catch (e) {}

  // Group by year
  const byYear = exhibitions.reduce((acc, ex) => {
    const y = ex.year || 'Undated'
    if (!acc[y]) acc[y] = []
    acc[y].push(ex)
    return acc
  }, {})
  const years = Object.keys(byYear).sort((a, b) => b - a)

  useEffect(() => {
    document.body.classList.add('is-light')

    if (revealRef.current) {
      const revealXTo = gsap.quickTo(revealRef.current, 'left', { duration: 0.8, ease: 'power3' })
      const revealYTo = gsap.quickTo(revealRef.current, 'top', { duration: 0.8, ease: 'power3' })
      const onMove = (e) => { 
        window.exhibitionsMouseY = e.clientY
        revealXTo(e.clientX - 150); 
        revealYTo(e.clientY - 200) 
      }
      window.addEventListener('mousemove', onMove)
    }

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

    const handleScrollHide = () => {
      const section = document.getElementById('exhibition-list-section') || document.body
      const rect = section.getBoundingClientRect()
      const my = window.exhibitionsMouseY || window.innerHeight / 2
      // Only hide if we have scrolled significantly away from the top where exhibitions are, or if mouse left bounds
      if (my < rect.top || my > rect.bottom || window.scrollY > document.body.scrollHeight - window.innerHeight) {
        if (revealRef.current) gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' })
      }
    }
    window.addEventListener('scroll', handleScrollHide)

    return () => {
      ctx.revert()
      document.body.classList.remove('is-light')
      window.removeEventListener('scroll', handleScrollHide)
    }
  }, [])

  const handleEnter = (image, index) => {
    if (window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || !revealRef.current) return
    if (revealInnerRef.current) {
      const imgUrl = image || FALLBACK_HOVERS[index % FALLBACK_HOVERS.length]
      revealInnerRef.current.style.backgroundImage = `url(${imgUrl})`
      revealInnerRef.current.style.backgroundColor = ''
    }
    gsap.to(revealRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
  }

  const handleLeave = () => {
    if (!revealRef.current) return
    gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' })
  }

  return (
    <>
      <SEOHead title="Exhibitions" description="A complete archive of solo and group exhibitions." />

      {/* Hover reveal */}
      <div ref={revealRef} className="fixed w-[300px] h-[400px] top-0 left-0 pointer-events-none z-[250] opacity-0 overflow-hidden" style={{ transform: 'scale(0.8)' }}>
        <div ref={revealInnerRef} className="w-full h-full bg-cover bg-center bg-stone-200" />
      </div>

      {/* Hero */}
      <section 
        className="min-h-[40vh] flex flex-col justify-end px-6 md:px-24 pt-32 pb-12 bg-light-bg text-dark-text"
        onMouseLeave={handleLeave}
      >
        <span className="font-label text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-6 block">Archive</span>
        <div className="flex flex-col md:flex-row justify-between items-end">
          <h1 className="font-headline text-[14vw] md:text-[7vw] leading-[0.85] tracking-tighter">
            The <i>Archive</i>
          </h1>
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">
            {exhibitions.length} exhibitions
          </span>
        </div>
      </section>

      {/* Exhibition list grouped by year */}
      <section 
        className="px-6 md:px-24 pb-24 bg-light-bg text-dark-text"
        onMouseLeave={handleLeave}
      >
        {years.length === 0 ? (
          <p className="font-body text-stone-500 text-sm pt-8">No exhibitions yet. Add them through the CMS.</p>
        ) : years.map(year => (
          <div key={year} className="mb-0">
            <div className="archive-list border-t border-stone-300">
              {byYear[year].map((ex, i) => (
                <div
                  key={i}
                  className="archive-row flex flex-col md:grid md:grid-cols-12 items-start md:items-center py-8 md:py-10 border-b border-stone-200 cursor-none reveal-item"
                  onMouseEnter={() => handleEnter(ex.image, i)}
                  onMouseLeave={handleLeave}
                >
                  <div className="md:col-span-1 font-label text-[10px] md:text-[10px] uppercase tracking-widest text-stone-500 mb-2 md:mb-0">{ex.year}</div>
                  <div className="md:col-span-6 font-headline text-2xl md:text-5xl italic tracking-tight mb-2 md:mb-0 hover:translate-x-4 transition-transform duration-500 ease-out">{ex.title}</div>
                  <div className="md:col-span-3 font-label text-[10px] uppercase tracking-widest text-stone-500 mb-1 md:mb-0">
                    {ex.venue}{ex.city ? `, ${ex.city}` : ''}
                  </div>
                  <div className="md:col-span-2 md:text-right font-label text-[10px] uppercase tracking-[0.2em] text-stone-500">{ex.exhibition_type}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
