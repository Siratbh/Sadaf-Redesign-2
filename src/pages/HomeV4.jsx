import { motion as Motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, Instagram, Facebook, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPaintings, getAvailablePaintings, getPastPaintings, getExhibitions, getPage, getCollectors } from '../lib/content';
import { introComponents } from '../lib/markdownComponents';
import { gsap } from 'gsap';
import SEOHead from '../components/SEOHead';
import CdnImage from '../components/CdnImage';
import { netlifyImage } from '../lib/image';
import siteSettings from '../../content/settings/site.json';

// --- Hero Slideshow Component ---
const HeroSlideshow = ({ paintings, slideshowLabel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (paintings.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % paintings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paintings]);

  if (paintings.length === 0) return null;

  const current = paintings[currentIndex];

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        <Motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
          {...(current._id ? { 'data-sb-object-id': current._id } : {})}
        >
          <CdnImage
            src={current.featured_image}
            alt={current.title}
            widths={[640, 960, 1280, 1600]}
            sizes="100vw"
            q={78}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
            data-sb-field-path="featured_image"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white md:bottom-8 md:left-8 md:right-auto md:p-0">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-1">{slideshowLabel}</p>
            <h3 className="text-base font-serif italic sm:text-lg md:text-xl" data-sb-field-path="title">{current.title}</h3>
          </div>
        </Motion.div>
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

const splitParagraphs = (value = '') =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const GalleryItem = ({ art, showStatus = false }) => {
  const image = art.thumbnail_image || art.featured_image;

  if (!image) return null;

  const statusLabel = 'In Private Collection';

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
      {...(art._id ? { 'data-sb-object-id': art._id } : {})}
    >
      <Link to={`/paintings/${art.slug}`} className="relative aspect-[4/5] overflow-hidden bg-transparent">
        <CdnImage
          src={image}
          alt={art.title}
          widths={[300, 450, 600]}
          sizes="(max-width: 768px) 45vw, 30vw"
          fit="contain"
          q={70}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110"
          data-sb-field-path={art.thumbnail_image ? 'thumbnail_image' : 'featured_image'}
        />
        {showStatus && (
          <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-brand-muted">
            {statusLabel}
          </span>
        )}
        <div className="absolute inset-0 hidden bg-black/0 transition-colors sm:flex group-hover:bg-black/20 items-center justify-center">
          <Motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300"
          >
            View this piece
          </Motion.span>
        </div>
      </Link>

      <div className="mt-4 flex justify-center">
        <Link
          to={`/paintings/${art.slug}`}
          className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-ink border-b border-brand-ink pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors duration-300"
        >
          View
        </Link>
      </div>
    </Motion.div>
  );
};

export default function HomeV4() {
  const revealRef = useRef(null);
  const revealInnerRef = useRef(null);
  const collectorsScrollRef = useRef(null);

  // Click-and-drag horizontal scroll for the Collectors Edit carousel.
  // (Native overflow-x is keyboard / touch / trackpad scrollable already;
  // this adds desktop-mouse drag-to-scroll on top.)
  useEffect(() => {
    const el = collectorsScrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    const onDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftStart = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeftStart - (x - startX);
    };
    const onUp = () => { isDown = false; };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mouseleave', onUp);
    };
  }, []);

  const paintings = getPaintings();
  const availablePaintings = getAvailablePaintings();
  const pastPaintings = getPastPaintings();
  const exhibitions = getExhibitions();
  const collectors = getCollectors();
  // Skip collector entries that have no usable image — otherwise the homepage
  // carousel renders a broken thumbnail. Entry stays in Decap so it can be fixed.
  const visibleCollectors = collectors.filter((c) => c.image);
  const home = getPage('home') || {};
  const aboutPage = getPage('about') || {};
  // Social links reuse the single source of truth in site.json (same as the Footer).
  const instagramUrl = siteSettings.instagram;
  const facebookUrl = siteSettings.facebook;
  const inquiryEmail = siteSettings.inquiry_email || siteSettings.email || 'inquiry@sadafart.com';
  const artistImage = home.portrait_image || "/images/about/Sadaf-Hero-Portrait.jpg";
  const heroPortrait = home.hero_portrait_image; // optional B&W portrait, top-right of hero
  const aboutParagraphs = splitParagraphs(aboutPage.bio_body);
  const aboutPreview = aboutParagraphs.slice(0, 3);

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
    revealInnerRef.current.style.backgroundImage = `url(${netlifyImage(image, { w: 600, q: 72 })})`;
    gsap.to(revealRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
  };

  const handleLeave = () => {
    if (!revealRef.current) return;
    gsap.to(revealRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.in' });
  };

  return (
    <div className="min-h-screen bg-brand-bg" {...(home._id ? { 'data-sb-object-id': home._id } : {})}>
      <SEOHead title="Home" />

      {/* Hover reveal for exhibitions */}
      <div ref={revealRef} className="fixed w-[300px] h-[400px] top-0 left-0 pointer-events-none z-[250] opacity-0 overflow-hidden" style={{ transform: 'scale(0.8)' }}>
        <div ref={revealInnerRef} className="w-full h-full bg-cover bg-center bg-transparent" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <Motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-serif leading-tight mb-6 sm:text-4xl md:text-5xl md:mb-8"
            >
              <span data-sb-field-path="hero_headline_line1">{home.hero_headline_line1 || 'Explore the intersection'}</span>
              <span className="block md:inline" data-sb-field-path="hero_headline_line2"> {home.hero_headline_line2 || 'of spirituality and abstraction'}</span>
            </Motion.h1>
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl space-y-4 text-brand-muted"
              data-sb-field-path="hero_subhead"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={introComponents}
              >
                {home.hero_subhead || ''}
              </ReactMarkdown>
            </Motion.div>
          </div>

          {heroPortrait && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
              className="w-full md:w-[25%] md:max-w-[240px] md:flex-shrink-0"
            >
              <div className="relative aspect-[16/9] md:aspect-[4/5] overflow-hidden">
                <CdnImage
                  src={heroPortrait}
                  alt="Sadaf Farasat"
                  widths={[240, 480]}
                  sizes="(max-width: 768px) 100vw, 240px"
                  q={72}
                  width="570"
                  height="760"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover grayscale"
                  data-sb-field-path="hero_portrait_image"
                />
              </div>
            </Motion.div>
          )}
        </div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-[48vh] overflow-hidden relative sm:h-[56vh] md:h-[60vh]"
        >
          <HeroSlideshow
            paintings={paintings.filter(p => p.featured)}
            slideshowLabel={home.hero_slideshow_label || 'Featured Work'}
          />
        </Motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
            <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl" data-sb-field-path="available_title">{home.available_title || 'Available Works'}</h2>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
            {availablePaintings.map((art) => (
              <div key={art.slug}>
                <GalleryItem art={art} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-6 md:mt-20">
            <Link to="/available" className="group flex w-full items-center justify-center space-x-3 border border-brand-ink px-6 py-4 text-center hover:bg-brand-ink hover:text-brand-bg transition-all duration-300 sm:w-auto sm:px-8">
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold" data-sb-field-path="available_cta">{home.available_cta || 'View available works'}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/past-works" className="text-brand-muted text-[11px] uppercase tracking-[0.2em] font-semibold border-b border-brand-muted pb-1 hover:text-brand-ink hover:border-brand-ink transition-colors" data-sb-field-path="available_secondary_cta">
              {home.available_secondary_cta || 'Browse past works →'}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black text-white md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-16 md:mb-24">
            {/* Single framed B&W portrait — intimate scale, centered above the title. */}
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-12 w-full max-w-[280px] sm:max-w-[340px] md:mb-16 md:max-w-[400px]"
            >
              <div className="relative overflow-hidden ring-1 ring-white/10 shadow-[0_45px_80px_-25px_rgba(0,0,0,0.9)]">
                <CdnImage
                  src={artistImage}
                  alt="Sadaf Farasat"
                  widths={[280, 400, 800]}
                  sizes="(max-width: 768px) 80vw, 400px"
                  q={78}
                  loading="lazy"
                  decoding="async"
                  className="w-full grayscale transition-all duration-[1200ms] ease-out group-hover:grayscale-0"
                  data-sb-field-path="portrait_image"
                />
                {/* Soft fade seats the portrait into the black section. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </Motion.div>

            <Motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-serif text-center leading-[1.1] max-w-5xl tracking-tight sm:text-4xl md:text-5xl lg:text-7xl"
              data-sb-field-path="about_big_title"
            >
              {home.about_big_title || 'About the artist'}
            </Motion.h2>
          </div>

          <div className="w-full h-[1px] bg-white/10 mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
                <h3 className="text-[14px] md:text-[16px] uppercase tracking-[0.1em] font-black" data-sb-field-path="about_section_label">{home.about_section_label || 'About the artist'}</h3>
              </div>
              <div className="md:col-span-8">
                <div className="max-w-2xl text-[14px] md:text-[15px] font-normal text-white/60 leading-[1.7] space-y-6 md:space-y-8">
                  <div {...(aboutPage._id ? { 'data-sb-object-id': aboutPage._id } : {})} className="space-y-6 md:space-y-8">
                    {aboutPreview.map((paragraph, index) => (
                      <p key={index} data-sb-field-path="bio_body">{paragraph}</p>
                    ))}
                  </div>
                  <Link to="/about" className="inline-block text-white border-b border-white pb-1 text-[12px] uppercase tracking-[0.2em] font-bold" data-sb-field-path="about_cta">{home.about_cta || 'Read Full Biography'}</Link>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* ── Follow / Social Section ────────────────────────────── */}
      {/* Sits directly under the dark About block — same black ground, a hairline
          divider — so "about the artist" and "follow the artist" read as one
          editorial moment. The @handle is the focal point. */}
      <section id="follow" className="bg-black text-white border-t border-white/10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-16"
          >
            <div className="lg:col-span-7">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40" data-sb-field-path="social_subhead">
                {home.social_subhead || 'Stay close to the studio'}
              </p>
              <h2 className="font-serif text-4xl leading-[1.0] sm:text-5xl md:text-6xl" data-sb-field-path="social_title">
                {home.social_title || 'Follow the journey'}
              </h2>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-3 text-white/85 transition-colors hover:text-white"
                >
                  <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl" data-sb-field-path="social_handle">
                    {home.social_handle || '@studiosadaffarasat'}
                  </span>
                  <ArrowUpRight
                    size={28}
                    strokeWidth={1.5}
                    className="text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
                  />
                </a>
              )}
            </div>

            <div className="lg:col-span-5 lg:justify-self-end">
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 border border-white/80 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 hover:bg-white hover:text-black"
                  >
                    <Instagram size={18} strokeWidth={1.75} />
                    <span data-sb-field-path="social_cta">{home.social_cta || 'Follow on Instagram'}</span>
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-[52px] w-[52px] items-center justify-center border border-white/20 text-white/70 transition-colors duration-300 hover:border-white hover:text-white"
                  >
                    <Facebook size={18} strokeWidth={1.75} />
                  </a>
                )}
                <a
                  href={`mailto:${inquiryEmail}`}
                  aria-label="Email"
                  className="inline-flex h-[52px] w-[52px] items-center justify-center border border-white/20 text-white/70 transition-colors duration-300 hover:border-white hover:text-white"
                >
                  <Mail size={18} strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* Past Works Section */}
      <section id="past-works" className="py-16 bg-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
            <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl" data-sb-field-path="past_works_title">{home.past_works_title || 'Past Works'}</h2>
            <p className="mt-3 text-brand-muted text-[11px] uppercase tracking-[0.2em] font-semibold sm:mt-4" data-sb-field-path="past_works_subhead">
              {home.past_works_subhead || 'An archive of works now in private collections'}
            </p>
          </div>

          {pastPaintings.length === 0 ? (
            <p className="text-brand-muted text-sm font-light italic">Coming soon.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
                {pastPaintings.slice(0, 6).map((art) => (
                  <div key={art.slug}>
                    <GalleryItem art={art} showStatus />
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-center md:mt-20">
                <Link to="/past-works" className="group flex w-full items-center justify-center space-x-3 border border-brand-ink px-6 py-4 text-center hover:bg-brand-ink hover:text-brand-bg transition-all duration-300 sm:w-auto sm:px-8">
                  <span className="text-[12px] uppercase tracking-[0.2em] font-semibold" data-sb-field-path="past_works_cta">{home.past_works_cta || 'Browse all past works'}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Collectors Edit Section ────────────────────────────── */}
      <section id="collectors" className="py-20 bg-brand-bg md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 border-b border-gray-100 pb-6 md:mb-16 md:pb-8">
            <h2 className="text-2xl font-serif uppercase tracking-[0.1em] sm:text-3xl md:text-4xl" data-sb-field-path="collectors_title">
              {home.collectors_title || 'Collectors Edit'}
            </h2>
            <p className="mt-3 text-brand-muted text-[11px] uppercase tracking-[0.2em] font-semibold sm:mt-4" data-sb-field-path="collectors_subhead">
              {home.collectors_subhead || 'A glimpse of these works in the homes of their collectors'}
            </p>
          </div>
        </div>

        {visibleCollectors.length > 0 ? (
          <>
            <div
              ref={collectorsScrollRef}
              data-lenis-prevent
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 px-4 sm:px-6 pb-4
                         scrollbar-hide cursor-grab active:cursor-grabbing select-none"
              style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem' }}
            >
              {visibleCollectors.map((item) => (
                <div
                  key={item.slug}
                  className="flex-shrink-0 w-[85vw] max-w-lg snap-center"
                  {...(item._id ? { 'data-sb-object-id': item._id } : {})}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-transparent">
                    <CdnImage
                      src={item.image}
                      alt={item.title}
                      widths={[480, 720, 960]}
                      sizes="85vw"
                      q={72}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      data-sb-field-path="image"
                    />
                  </div>
                  {item.painting_title && (
                    <p className="mt-3 text-sm text-brand-muted font-sans tracking-wide uppercase" data-sb-field-path="painting_title">
                      {item.painting_title}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
              <Link
                to="/collectors-edit"
                className="inline-block border border-brand-ink text-brand-ink px-8 py-3 text-xs uppercase tracking-widest
                           hover:bg-brand-ink hover:text-white transition-colors duration-300"
                data-sb-field-path="collectors_cta"
              >
                {home.collectors_cta || 'View All'}
              </Link>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-brand-muted/60 italic">Coming soon.</p>
          </div>
        )}
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions" className="py-20 px-4 bg-white sm:px-6 md:py-32" onMouseLeave={handleLeave}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20">
            <h2 className="text-2xl font-serif mb-4 uppercase tracking-[0.1em] sm:text-3xl md:text-4xl" data-sb-field-path="exhibitions_title">{home.exhibitions_title || 'Past Exhibitions'}</h2>
            <p className="text-brand-muted tracking-widest text-[11px] uppercase font-semibold" data-sb-field-path="exhibitions_subhead">{home.exhibitions_subhead || 'A complete archive of solo and group exhibitions'}</p>
          </div>

          <div className="divide-y divide-gray-100">
            {exhibitions.slice(0, 5).map((ex, i) => (
              <Link
                key={i}
                to="/exhibitions"
                className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 cursor-pointer md:py-12"
                onMouseEnter={() => handleEnter(ex.image)}
                {...(ex._id ? { 'data-sb-object-id': ex._id } : {})}
              >
                <div>
                  <h4 className="text-xl font-serif mb-2 group-hover:text-brand-accent transition-colors sm:text-2xl" data-sb-field-path="title">{ex.title}</h4>
                  <p className="text-brand-muted text-xs uppercase tracking-widest sm:text-sm"><span data-sb-field-path="venue">{ex.venue}</span>{ex.city ? <>, <span data-sb-field-path="city">{ex.city}</span></> : ''}</p>
                </div>
                <div className="text-right flex flex-col items-start md:items-end">
                  <span className="text-brand-ink font-medium tracking-tight mb-2" data-sb-field-path="year">{ex.year}</span>
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] flex items-center space-x-2 transition-transform md:group-hover:translate-x-2">
                      <span>View Archive</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          <div className="mt-12">
            <Link to="/exhibitions" className="text-brand-ink border-b border-brand-ink pb-1 text-[11px] uppercase tracking-[0.2em] font-bold" data-sb-field-path="exhibitions_cta">{home.exhibitions_cta || 'Explore Full Archive'}</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-gray-100 bg-white md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6">
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-serif mb-6 uppercase tracking-[0.1em] sm:text-4xl md:text-6xl md:mb-8" data-sb-field-path="contact_headline">{home.contact_headline || 'Got Inspired?'}</h2>
            <p className="text-brand-muted text-base font-light mb-10 sm:text-lg md:mb-12" data-sb-field-path="contact_body">
              {home.contact_body || 'Reserve your piece or get in touch for an exclusive appointment at our private showroom.'}
            </p>
            <Link
              to="/contact"
              className="inline-block w-full bg-brand-ink px-8 py-4 text-brand-bg text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-300 sm:w-auto sm:px-12 sm:py-5"
              data-sb-field-path="contact_cta"
            >
              {home.contact_cta || 'Get in touch'}
            </Link>
          </Motion.div>
        </div>
      </section>

      {/* Footer is already in App.jsx wrapper */}
    </div>
  );
}