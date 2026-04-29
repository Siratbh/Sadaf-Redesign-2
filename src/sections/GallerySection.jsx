import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GallerySection({ artworks }) {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!artworks || artworks.length === 0) return

    const totalScrollWidth = containerRef.current.scrollWidth
    const viewportWidth = window.innerWidth

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        x: () => -(totalScrollWidth - viewportWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${totalScrollWidth}`,
          anticipatePin: 1
        }
      })
    })

    return () => ctx.revert()
  }, [artworks])

  if (!artworks || artworks.length === 0) return null

  // Double the fallback artworks if there are too few to make a good scroll
  const displayArtworks = artworks.length < 8 ? [...artworks, ...artworks] : artworks

  return (
    <section ref={sectionRef} className="h-screen w-full bg-surface-container-lowest overflow-hidden flex items-center pt-32">
      <div className="absolute top-12 left-12 md:top-32 md:left-24 z-10 w-full pr-12">
        <h2 className="font-headline text-3xl md:text-5xl text-on-surface mb-2">Selected Works</h2>
        <p className="font-body text-sm md:text-md text-on-surface-variant font-light">Scroll to explore</p>
      </div>
      
      <div ref={containerRef} className="flex h-full items-center gap-12 md:gap-24 px-12 md:px-32 pr-[30vw] pt-24 pb-12 w-max">
        {displayArtworks.map((artwork, i) => (
          <div 
            key={i} 
            className="group relative flex-shrink-0 cursor-pointer h-[50vh] md:h-[65vh] aspect-[3/4] overflow-hidden"
            onClick={() => artwork?.slug && navigate(`/paintings/${artwork.slug}`)}
          >
            <div className="w-full h-full bg-surface-dim">
              <img 
                src={artwork.featured_image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80'} 
                alt={artwork.title}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
            
            {/* Screenshot-style "View this piece" overlay */}
            <div className="absolute bottom-6 w-full flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="bg-white text-on-surface px-6 py-3 font-body text-sm tracking-wide shadow-lg">
                View this piece
              </div>
            </div>
            
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-surface/80 backdrop-blur-md px-3 py-1 font-headline text-sm italic text-on-surface shadow-sm">
                  {artwork.title}
                </div>
            </div>
          </div>
        ))}

        {/* End Element: Explore All Collections */}
        <div className="flex-shrink-0 h-[50vh] md:h-[65vh] w-[40vw] max-w-[600px] flex flex-col justify-center items-center text-center px-12 border-l border-outline-variant/30 pl-24 ml-12">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-6 block">Continue</span>
          <h3 className="font-headline text-4xl md:text-5xl leading-tight tracking-tighter italic text-on-surface mb-8">
            Explore All Collections
          </h3>
          <Link 
            to="/collections" 
            className="inline-flex items-center text-on-surface border-b border-outline-variant pb-1 text-sm tracking-widest uppercase hover:border-on-surface transition-colors"
          >
            View Collections
            <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
