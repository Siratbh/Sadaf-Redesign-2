import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

// --- Types ---
interface ArtPiece {
  id: string;
  artist: string;
  title: string;
  image: string;
  year: string;
}

// --- Data ---
const ART_PIECES: ArtPiece[] = [
  { id: '1', artist: 'Sadaf Farasat', title: 'Eternal Sands', image: 'https://picsum.photos/seed/art1/800/1000', year: '2023' },
  { id: '2', artist: 'Sadaf Farasat', title: 'Oceanic Whispers', image: 'https://picsum.photos/seed/art2/800/1000', year: '2023' },
  { id: '3', artist: 'Sadaf Farasat', title: 'Fragmented Soul', image: 'https://picsum.photos/seed/art3/800/1000', year: '2024' },
  { id: '4', artist: 'Sadaf Farasat', title: 'Monochromatic Gaze', image: 'https://picsum.photos/seed/art4/800/1000', year: '2024' },
  { id: '5', artist: 'Sadaf Farasat', title: 'Abstract Energy I', image: 'https://picsum.photos/seed/art5/800/1000', year: '2022' },
  { id: '6', artist: 'Sadaf Farasat', title: 'Vibrant Paradox', image: 'https://picsum.photos/seed/art6/800/1000', year: '2023' },
  { id: '7', artist: 'Sadaf Farasat', title: 'Vertical Rhythms', image: 'https://picsum.photos/seed/art7/800/1000', year: '2023' },
  { id: '8', artist: 'Sadaf Farasat', title: 'Shadow Play', image: 'https://picsum.photos/seed/art8/800/1000', year: '2023' },
  { id: '9', artist: 'Sadaf Farasat', title: 'Stone Silence', image: 'https://picsum.photos/seed/art9/800/1000', year: '2021' },
  { id: '10', artist: 'Sadaf Farasat', title: 'Iron Wind', image: 'https://picsum.photos/seed/art10/800/1000', year: '2022' },
  { id: '11', artist: 'Sadaf Farasat', title: 'Desert Rose', image: 'https://picsum.photos/seed/art11/800/1000', year: '2023' },
  { id: '12', artist: 'Sadaf Farasat', title: 'Hidden Lines', image: 'https://picsum.photos/seed/art12/800/1000', year: '2024' },
  { id: '13', artist: 'Sadaf Farasat', title: 'Cosmic Flow', image: 'https://picsum.photos/seed/art13/800/1000', year: '2022' },
  { id: '14', artist: 'Sadaf Farasat', title: 'Urban Echo', image: 'https://picsum.photos/seed/art14/800/1000', year: '2021' },
  { id: '15', artist: 'Sadaf Farasat', title: 'Clay Form', image: 'https://picsum.photos/seed/art15/800/1000', year: '2023' },
];

const EXHIBITIONS = [
  { id: 'e1', title: 'Ethereal Forms', location: 'Gallery Brussels', date: 'May 12 - June 30, 2026' },
  { id: 'e2', title: 'The Modern Gaze', location: 'Antwerp Art House', date: 'Sept 5 - Oct 20, 2026' },
  { id: 'e3', title: 'Collective Harmony', location: 'Paris Expo', date: 'Dec 1 - Dec 15, 2026' },
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-1 hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-medium text-brand-muted">
          <a href="#gallery" className="hover:text-brand-ink transition-colors">Catalog</a>
          <a href="#about" className="hover:text-brand-ink transition-colors">About</a>
          <a href="#exhibitions" className="hover:text-brand-ink transition-colors">Events</a>
        </div>
        
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-serif tracking-[0.2em] uppercase text-brand-ink">Sadaf Farasat</h1>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-8">
          <div className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-medium text-brand-muted">
            <a href="#contact" className="hover:text-brand-ink transition-colors underline underline-offset-4">Book exclusive appointment</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4 text-[11px] uppercase tracking-widest font-medium">
              <a href="#gallery" onClick={() => setIsOpen(false)}>Catalog</a>
              <a href="#about" onClick={() => setIsOpen(false)}>About</a>
              <a href="#exhibitions" onClick={() => setIsOpen(false)}>Events</a>
              <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const GalleryItem = ({ art }: { art: ArtPiece }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
    >
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">
          {art.artist}
        </span>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={art.image} 
          alt={art.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white text-brand-ink text-[11px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
          >
            View this piece
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif leading-tight mb-8"
            >
              Make a reservation from our <br /> art collection
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-muted leading-relaxed font-light text-sm max-w-lg"
            >
              With a wealth of experience as a curator, Sadaf Farasat is now an independent space 
              dedicated to showcasing the finest contemporary works. We ensure a safe 
              transaction and shipping of goods. You can rest on both ears.
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-[60vh] overflow-hidden relative"
        >
          <img 
            src="https://picsum.photos/seed/hero/1920/1080" 
            alt="Hero Exhibition" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 border-b border-gray-100 pb-8">
            <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.1em]">Collections</h2>
          </div>

          <div className="gallery-grid">
            {ART_PIECES.map((art) => (
              <div key={art.id}>
                <GalleryItem art={art} />
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button className="group flex items-center space-x-3 px-8 py-4 border border-brand-ink hover:bg-brand-ink hover:text-brand-bg transition-all duration-300">
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold">Explore all collections</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section - Matching reference image 1:1 */}
      <section id="about" className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Part: Stacked Images and Headline */}
          <div className="flex flex-col items-center mb-24">
            <div className="relative w-full max-w-4xl aspect-[1.4] mb-16 flex justify-center items-end">
              {/* Stacked Images Effect from Image.png */}
              <div className="absolute top-0 left-[12%] w-[45%] -rotate-2 z-0">
                <img 
                  src="https://picsum.photos/seed/about-land1/1000/1200" 
                  alt="Atmospheric Art" 
                  referrerPolicy="no-referrer"
                  className="w-full grayscale brightness-75 transition-all duration-700 hover:brightness-100"
                />
              </div>
              <div className="absolute top-[8%] right-[12%] w-[45%] rotate-1 z-10">
                <img 
                  src="https://picsum.photos/seed/about-land2/1000/1200" 
                  alt="Detail Work" 
                  referrerPolicy="no-referrer"
                  className="w-full grayscale brightness-50 transition-all duration-700 hover:brightness-100"
                />
              </div>
              <div className="relative z-20 w-[38%] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]">
                <img 
                  src="https://picsum.photos/seed/sadaf-portrait/800/1000" 
                  alt="Sadaf Farasat" 
                  referrerPolicy="no-referrer"
                  className="w-full"
                />
              </div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-7xl font-serif text-center leading-[1.1] max-w-5xl tracking-tight"
            >
              I'm all about creating <br />
              something that feels unique, <br />
              from wild ideas <br />
              to a polished canvas.
            </motion.h2>
          </div>

          {/* Divider line exactly like image */}
          <div className="w-full h-[1px] bg-white/10 mb-16" />

          {/* Bottom Part: Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h3 className="text-[14px] md:text-[16px] uppercase tracking-[0.1em] font-black">A bit about me</h3>
            </div>
            <div className="md:col-span-8">
              <div className="max-w-2xl text-[14px] md:text-[15px] font-normal text-white/60 leading-[1.7] space-y-8">
                <p>
                  Hey there! I'm Sadaf Farasat, an Independent Artist and Curator, 
                  partnering with cutting-edge branding studios and galleries around the globe.
                </p>
                <p>
                  I enjoy collaborating with creative teams to create something that feels unique, 
                  from wild ideas to a polished canvas.
                </p>
                <p>
                  Previously working as a creative lead, I have experience in strategic thinking, 
                  managing stakeholders, and presenting groundbreaking artistic ideas.
                </p>
                <p>
                  My architectural background has also trained my eye to catch those 
                  little visual details and focus on balance and composition in my designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-serif mb-4">Upcoming Exhibitions</h2>
            <p className="text-brand-muted tracking-widest text-[11px] uppercase font-semibold">Join us at our next events world-wide</p>
          </div>

          <div className="divide-y divide-gray-100">
            {EXHIBITIONS.map((ex) => (
              <motion.div 
                key={ex.id}
                whileHover={{ x: 10 }}
                className="group py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
              >
                <div>
                  <h4 className="text-2xl font-serif mb-2 group-hover:text-brand-accent transition-colors">{ex.title}</h4>
                  <p className="text-brand-muted text-sm uppercase tracking-widest">{ex.location}</p>
                </div>
                <div className="text-right flex flex-col items-start md:items-end">
                  <span className="text-brand-ink font-medium tracking-tight mb-2">{ex.date}</span>
                  <button className="text-[10px] uppercase font-bold tracking-[0.2em] flex items-center space-x-2 group-hover:translate-x-2 transition-transform">
                    <span>Reserve Tickets</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section / CTA */}
      <section id="contact" className="py-20 border-t border-gray-100 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Got Inspired?</h2>
            <p className="text-brand-muted text-lg font-light mb-12">
              Reserve your piece or get in touch for an exclusive appointment at our private showroom.
            </p>
            <a 
              href="mailto:contact@artis.gallery"
              className="inline-block px-12 py-5 bg-brand-ink text-brand-bg text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-300"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1 md:col-span-1">
             <h1 className="text-2xl font-serif tracking-[0.2em] uppercase text-brand-ink mb-6">Sadaf Farasat</h1>
             <p className="text-brand-muted leading-relaxed">
               Bringing contemporary excellence to the forefront of the modern art market.
             </p>
          </div>
          
          <div className="col-span-1">
             <h4 className="uppercase tracking-widest font-bold text-[11px] mb-6">Inquiry</h4>
             <ul className="space-y-4 text-brand-muted">
               <li className="flex items-center space-x-3">
                 <Mail size={16} />
                 <span>contact@artis.gallery</span>
               </li>
               <li className="flex items-center space-x-3">
                 <Phone size={16} />
                 <span>+32 (0) 478 51 92 89</span>
               </li>
             </ul>
          </div>

          <div className="col-span-1">
             <h4 className="uppercase tracking-widest font-bold text-[11px] mb-6">Location</h4>
             <ul className="space-y-4 text-brand-muted">
               <li className="flex items-center space-x-3">
                 <MapPin size={16} />
                 <span>Brussels, Avenue Louise 12</span>
               </li>
               <li className="flex items-center space-x-3">
                 <MapPin size={16} />
                 <span>Paris, Rue de Rivoli 4</span>
               </li>
             </ul>
          </div>

          <div className="col-span-1">
             <h4 className="uppercase tracking-widest font-bold text-[11px] mb-6">Social</h4>
             <div className="flex space-x-6 text-brand-muted">
               <a href="#" className="hover:text-brand-ink transition-colors"><Instagram size={20} /></a>
               <a href="#" className="hover:text-brand-ink transition-colors"><Mail size={20} /></a>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-brand-muted font-bold">
          <p>© 2026 Sadaf Farasat. Created with Elegance.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
