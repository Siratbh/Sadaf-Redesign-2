import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'

const FALLBACK_HOVERS = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80'
]

export default function ArchiveSection({ exhibitions }) {
  const revealRef = useRef(null)
  const revealInnerRef = useRef(null)

  useEffect(() => {
    if (!revealRef.current) return
    const reveal = revealRef.current
    const revealXTo = gsap.quickTo(reveal, 'left', { duration: 0.8, ease: 'power3' })
    const revealYTo = gsap.quickTo(reveal, 'top', { duration: 0.8, ease: 'power3' })
    const onMove = (e) => {
      window.archiveMouseY = e.clientY
      revealXTo(e.clientX - 150)
      revealYTo(e.clientY - 200)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleMouseEnter = (image, index) => {
    if (window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) return
    if (revealInnerRef.current) {
      const imgUrl = image || FALLBACK_HOVERS[index % FALLBACK_HOVERS.length]
      revealInnerRef.current.style.backgroundImage = `url(${imgUrl})`
      revealInnerRef.current.style.backgroundColor = ''
    }
    gsap.to(revealRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
  }

  const handleMouseLeave = () => {
    gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' })
  }

  useEffect(() => {
    const handleScrollHide = () => {
      const section = document.getElementById('archive-section')
      if (section) {
        const rect = section.getBoundingClientRect()
        const my = window.archiveMouseY || window.innerHeight / 2
        // Force hide if mouse is outside the section boundaries vertically
        if (my < rect.top || my > rect.bottom) {
          handleMouseLeave()
        }
      }
    }
    window.addEventListener('scroll', handleScrollHide)
    return () => window.removeEventListener('scroll', handleScrollHide)
  }, [])

  return (
    <section
      className="relative py-24 md:py-32 px-6 md:px-24 bg-surface text-on-surface overflow-hidden"
      id="archive-section"
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover reveal */}
      <div
        ref={revealRef}
        className="fixed w-[300px] h-[400px] top-0 left-0 pointer-events-none z-[250] opacity-0 overflow-hidden flex items-center justify-center ambient-shadow bg-surface-dim"
        style={{ transform: 'scale(0.8)' }}
      >
        <div
          ref={revealInnerRef}
          className="w-full h-full bg-cover bg-center grayscale-[20%]"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 reveal-item">
          <h2 className="font-headline text-5xl md:text-7xl leading-tight tracking-tighter mb-4 md:mb-0">
            The <i className="italic">Archive</i>
          </h2>
          <Link
            to="/exhibitions"
            className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-colors"
          >
            View All Exhibitions &rarr;
          </Link>
        </div>

        <div className="archive-list border-t border-outline-variant">
          {(exhibitions || []).slice(0, 5).map((ex, i) => (
            <div
              key={i}
              className="group flex flex-col md:grid md:grid-cols-12 items-start md:items-center py-8 md:py-10 border-b border-outline-variant transition-colors hover:bg-surface-container-low/50"
              onMouseEnter={() => handleMouseEnter(ex.image, i)}
              onMouseLeave={handleMouseLeave}
              {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}
            >
              <div className="md:col-span-1 font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 md:mb-0" data-sb-field-path="year">
                {ex.year}
              </div>
              <div className="md:col-span-6 font-headline text-2xl md:text-4xl italic tracking-tight mb-2 md:mb-0 group-hover:translate-x-4 transition-transform duration-500 ease-out" data-sb-field-path="title">
                {ex.title}
              </div>
              <div className="md:col-span-3 font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1 md:mb-0">
                <span data-sb-field-path="venue">{ex.venue}</span>{ex.city ? <>, <span data-sb-field-path="city">{ex.city}</span></> : ''}
              </div>
              <div className="md:col-span-2 md:text-right font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant" data-sb-field-path="exhibition_type">
                {ex.exhibition_type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
