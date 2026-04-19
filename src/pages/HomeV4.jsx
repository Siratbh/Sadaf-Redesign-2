import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings, getExhibitions } from '../lib/content';
import { gsap } from 'gsap';
import SEOHead from '../components/SEOHead';

// --- Hero Slideshow Component ---
const HeroSlideshow = ({ paintings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (paintings.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % paintings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paintings]);

  if (paintings.length === 0) return null;

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={paintings[currentIndex].featured_image}
            alt={paintings[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white md:bottom-8 md:left-8 md:right-auto md:p-0">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-1">Featured Work</p>
            <h3 className="text-base font-serif italic sm:text-lg md:text-xl">{paintings[currentIndex].title}</h3>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FALLBACK_HOVERS = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80'
];

const GalleryItem = ({ art }) => {
  const artistName = art.artist || 'Sadaf Farasat';
  const image = art.thumbnail_image || art.featured_image;

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">
          {artistName}
        </span>
        {art.year && (
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">
            {art.year}
          </span>
        )}
      </div>

      <Link to={`/paintings/${art.slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={art.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 hidden bg-black/0 transition-colors sm:flex group-hover:bg-black/20 items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300"
          >
            View this piece
          </motion.span>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-serif leading-tight text-brand-ink sm:text-xl">{art.title}</h3>
          {art.medium && (
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brand-muted">{art.medium}</p>
          )}
        </div>
        <Link
          to={`/paintings/${art.slug}`}
          className="shrink-0 text-[10px] uppercase tracking-[0.18em] font-semibold text-brand-ink border-b border-brand-ink pb-1 sm:hidden"
        >
          View
        </Link>
      </div>
    </motion.div>
  );
};

export default function HomeV4() {
  const revealRef = useRef(null);
  const revealInnerRef = useRef(null);

  const paintings = getPaintings();
  const exhibitions = getExhibitions();
  const artistImage = "/images/Sadaf Portrait.png";

  useEffect(() => {
    if (revealRef.current) {
      const revealXTo = gsap.quickTo(revealRef.current, 'left', { duration: 0.8, ease: 'power3' });
      const revealYTo = gsap.quickTo(revealRef.current, 'top', { duration: 0.8, ease: 'power3' });
      const onMove = (e) => { 
        revealXTo(e.clientX - 150); 
        revealYTo(e.clientY - 200); 
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }
  }, []);

  const handleEnter = (image) => {
    if (window.innerWidth <= 768 || !revealRef.current || !revealInnerRef.current) return;
    revealInnerRef.current.style.backgroundImage = `url(${image})`;
    gsap.to(revealRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
  };

  const handleLeave = () => {
    if (!revealRef.current) return;
    gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' });
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <SEOHead title="Home" />

      {/* Hover reveal for exhibitions */}
      <div ref={revealRef} className="fixed w-[300px] h-[400px] top-0 left-0 pointer-events-none z-[250] opacity-0 overflow-hidden" style={{ transform: 'scale(0.8)' }}>
        <div ref={revealInnerRef} className="w-full h-full bg-cover bg-center bg-stone-200" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-serif leading-tight mb-6 sm:text-4xl md:text-5xl md:mb-8"
            >
              Explore the intersection
              <span className="block md:inline"> of spirituality and abstraction</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-muted leading-relaxed font-light text-sm max-w-lg sm:text-[15px]"
            >
              Sadaf Farasat's work explores the profound depths of Sufi mysticism through 
              contemporary abstract expressionism, creating visual narratives that bridge 
              the traditional and the modern.
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-[48vh] overflow-hidden relative sm:h-[56vh] md:h-[60vh]"
        >
          <HeroSlideshow paintings={paintings.filter(p => p.featured)} />
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
            <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">Collections</h2>
          </div>

          <div className="gallery-grid">
            {paintings.map((art) => (
              <div key={art.slug}>
                <GalleryItem art={art} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center md:mt-20">
            <Link to="/collections" className="group flex w-full items-center justify-center space-x-3 border border-brand-ink px-6 py-4 text-center hover:bg-brand-ink hover:text-brand-bg transition-all duration-300 sm:w-auto sm:px-8">
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold">Explore all collections</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black text-white md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <div className="relative w-full max-w-4xl aspect-[1.05] mb-10 flex justify-center items-end sm:aspect-[1.2] md:aspect-[1.4] md:mb-16">
              {/* Stacked Images Effect */}
              <div className="absolute top-0 left-[12%] w-[45%] -rotate-2 z-0 hidden md:block">
                <img 
                  src={paintings[0]?.featured_image} 
                  alt="Atmospheric Art" 
                  className="w-full grayscale brightness-75 transition-all duration-700 hover:brightness-100"
                />
              </div>
              <div className="absolute top-[8%] right-[12%] w-[45%] rotate-1 z-10 hidden md:block">
                <img 
                  src={paintings[1]?.featured_image} 
                  alt="Detail Work" 
                  className="w-full grayscale brightness-50 transition-all duration-700 hover:brightness-100"
                />
              </div>
              <div className="relative z-20 w-[78%] sm:w-[62%] md:w-[38%] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]">
                <img 
                  src={artistImage} 
                  alt="Sadaf Farasat" 
                  className="w-full"
                />
              </div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-serif text-center leading-[1.1] max-w-5xl tracking-tight sm:text-4xl md:text-5xl lg:text-7xl"
            >
              I'm all about creating <br />
              something that feels unique, <br />
              from wild ideas <br />
              to a polished canvas.
            </motion.h2>
          </div>

          <div className="w-full h-[1px] bg-white/10 mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <h3 className="text-[14px] md:text-[16px] uppercase tracking-[0.1em] font-black">A bit about me</h3>
            </div>
            <div className="md:col-span-8">
              <div className="max-w-2xl text-[14px] md:text-[15px] font-normal text-white/60 leading-[1.7] space-y-6 md:space-y-8">
                <p>
                  Sadaf Farasat is an Independent Artist and Architect, exploring the intersection of 
                  mysticism, light, and geometry. Her work is a visual journey into the essence of form.
                </p>
                <p>
                  My architectural background has trained my eye to catch those 
                  little visual details and focus on balance and composition in my designs.
                </p>
                <Link to="/about" className="inline-block text-white border-b border-white pb-1 text-[12px] uppercase tracking-[0.2em] font-bold">Read Full Biography</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions" className="py-20 px-4 bg-white sm:px-6 md:py-32" onMouseLeave={handleLeave}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20">
            <h2 className="text-2xl font-serif mb-4 uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">Past Exhibitions</h2>
            <p className="text-brand-muted tracking-widest text-[11px] uppercase font-semibold">A complete archive of solo and group exhibitions</p>
          </div>

          <div className="divide-y divide-gray-100">
            {exhibitions.slice(0, 5).map((ex, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 cursor-pointer md:py-12"
                onMouseEnter={() => handleEnter(ex.image)}
              >
                <div>
                  <h4 className="text-xl font-serif mb-2 group-hover:text-brand-accent transition-colors sm:text-2xl">{ex.title}</h4>
                  <p className="text-brand-muted text-xs uppercase tracking-widest sm:text-sm">{ex.venue}, {ex.city}</p>
                </div>
                <div className="text-right flex flex-col items-start md:items-end">
                  <span className="text-brand-ink font-medium tracking-tight mb-2">{ex.year}</span>
                  <button className="text-[10px] uppercase font-bold tracking-[0.2em] flex items-center space-x-2 transition-transform md:group-hover:translate-x-2">
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/exhibitions" className="text-brand-ink border-b border-brand-ink pb-1 text-[11px] uppercase tracking-[0.2em] font-bold">Explore Full Archive</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-gray-100 bg-white md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-serif mb-6 uppercase tracking-[0.1em] sm:text-4xl md:text-6xl md:mb-8">Got Inspired?</h2>
            <p className="text-brand-muted text-base font-light mb-10 sm:text-lg md:mb-12">
              Reserve your piece or get in touch for an exclusive appointment at our private showroom.
            </p>
            <Link 
              to="/contact"
              className="inline-block w-full bg-brand-ink px-8 py-4 text-brand-bg text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-300 sm:w-auto sm:px-12 sm:py-5"
            >
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer is already in App.jsx wrapper */}
    </div>
  );
}
