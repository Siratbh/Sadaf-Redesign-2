import { useEffect, useRef } from 'react';
import { motion as Motion } from 'motion/react';
import SEOHead from '../components/SEOHead';
import { getExhibitions } from '../lib/content';
import { gsap } from 'gsap';

const FALLBACK_HOVERS = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80'
];

export default function Exhibitions() {
  const revealRef = useRef(null);
  const revealInnerRef = useRef(null);

  let exhibitions = [];
  try {
    exhibitions = getExhibitions();
  } catch {
    // ignore
  }

  // Group by year
  const byYear = exhibitions.reduce((acc, ex) => {
    const y = ex.year || 'Undated';
    if (!acc[y]) acc[y] = [];
    acc[y].push(ex);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return b - a;
  });

  useEffect(() => {
    if (revealRef.current) {
      const revealXTo = gsap.quickTo(revealRef.current, 'left', { duration: 0.8, ease: 'power3' });
      const revealYTo = gsap.quickTo(revealRef.current, 'top', { duration: 0.8, ease: 'power3' });
      
      const onMove = (e) => {
        window.exhibitionsMouseY = e.clientY;
        revealXTo(e.clientX - 150);
        revealYTo(e.clientY - 200);
      };
      
      window.addEventListener('mousemove', onMove);

      const handleScrollHide = () => {
        // Hide if we scroll out of bounds significantly
        if (window.scrollY > document.body.scrollHeight - window.innerHeight) {
          gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' });
        }
      };
      
      window.addEventListener('scroll', handleScrollHide);

      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('scroll', handleScrollHide);
      };
    }
  }, []);

  const handleEnter = (image, index) => {
    if (window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || !revealRef.current) return;
    if (revealInnerRef.current) {
      const imgUrl = image || FALLBACK_HOVERS[index % FALLBACK_HOVERS.length];
      revealInnerRef.current.style.backgroundImage = `url(${imgUrl})`;
      revealInnerRef.current.style.backgroundColor = '';
    }
    gsap.to(revealRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
  };

  const handleLeave = () => {
    if (!revealRef.current) return;
    gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' });
  };

  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <SEOHead title="Exhibitions" description="A complete archive of solo and group exhibitions." />

      {/* Hover reveal */}
      <div ref={revealRef} className="fixed w-[300px] h-[400px] top-0 left-0 pointer-events-none z-[250] opacity-0 overflow-hidden" style={{ transform: 'scale(0.8)' }}>
        <div ref={revealInnerRef} className="w-full h-full bg-cover bg-center bg-stone-200" />
      </div>

      {/* Hero Section */}
      <section 
        className="max-w-7xl mx-auto px-4 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20"
        onMouseLeave={handleLeave}
      >
        <Motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6 block"
        >
          Archive
        </Motion.span>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
          <Motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-serif sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
          >
            The <i>Archive</i>
          </Motion.h1>
          <Motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-2 md:mb-3"
          >
            {exhibitions.length} exhibitions
          </Motion.span>
        </div>
      </section>

      {/* Exhibition list grouped by year */}
      <section 
        className="max-w-7xl mx-auto px-4 pb-24 sm:px-6"
        onMouseLeave={handleLeave}
      >
        {years.length === 0 ? (
          <p className="text-brand-muted text-sm pt-8">No exhibitions yet. Add them through the CMS.</p>
        ) : years.map((year) => (
          <Motion.div 
            key={year} 
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl font-serif uppercase tracking-[0.1em] text-brand-ink">{year}</h2>
            </div>
            
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              {byYear[year].map((ex, i) => (
                <div
                  key={i}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 cursor-pointer py-8 md:py-12"
                  onMouseEnter={() => handleEnter(ex.image, i)}
                  onMouseLeave={handleLeave}
                >
                  <div>
                    <h4 className="text-xl font-serif mb-2 group-hover:text-brand-accent transition-colors sm:text-2xl">{ex.title}</h4>
                    <p className="text-brand-muted text-xs uppercase tracking-widest sm:text-sm">
                      {ex.venue}{ex.city ? `, ${ex.city}` : ''}
                    </p>
                  </div>
                  <div className="text-left md:text-right flex flex-col items-start md:items-end">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-ink">{ex.exhibition_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>
        ))}
      </section>
    </div>
  );
}
