import { Link } from 'react-router-dom'
import MediaPlaceholder from '../components/MediaPlaceholder'

export default function PersonaSection({ about }) {
  const a = about || {}
  return (
    <section
      className="relative py-24 md:py-32 px-6 md:px-24 flex flex-col justify-center items-center bg-surface-container-low"
      id="about-section"
      {...(a._id ? { 'data-sb-object-id': a._id } : {})}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left column */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="font-headline text-5xl lg:text-7xl leading-tight tracking-tighter mb-8 md:mb-12 text-on-surface reveal-item">
              The <br /><i className="italic">Artist</i>
            </h2>
            <div className="space-y-8 max-w-md reveal-item">
              <p className="font-label text-xs uppercase tracking-[0.2em] leading-relaxed text-on-surface-variant" data-sb-field-path="bio_intro">
                {a.bio_intro || 'An artist with over a decade of practice exploring the dialogue between light, shadow, and emotional memory.'}
              </p>
              <p className="font-body text-base md:text-lg text-on-surface-variant font-light leading-relaxed" data-sb-field-path="bio_body">
                {a.bio_body?.split('\n')[0] || 'Her practice is rooted in an intuitive dialogue with the canvas — each stroke an inquiry into the space between perception and reality.'}
              </p>
              <div className="pt-8">
                <Link
                  to="/about"
                  className="font-label text-xs uppercase tracking-widest border-b border-outline-variant pb-1 text-on-surface hover:border-on-surface transition-colors"
                >
                  Read Full Monograph
                </Link>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 relative">
            {a.portrait_image ? (
              <div className="w-full aspect-[4/5] bg-surface-dim overflow-hidden reveal-item">
                <img
                  alt="Artist portrait"
                  src={a.portrait_image}
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 hover:scale-105 transition-all duration-[2s] ease-out"
                  loading="lazy"
                  data-sb-field-path="portrait_image"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/5] bg-surface-dim reveal-item flex items-center justify-center text-on-surface-variant font-label text-xs">
                <MediaPlaceholder text="Artist Portrait" />
              </div>
            )}
            
            <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 w-2/3 md:w-1/2 aspect-video bg-surface p-2 shadow-sm hidden md:block reveal-item ambient-shadow">
               <video autoPlay muted loop playsInline className="w-full h-full object-cover grayscale-[50%]">
                 <source src="https://assets.mixkit.co/videos/preview/mixkit-artist-working-on-a-clay-sculpture-4416-large.mp4" type="video/mp4" />
               </video>
               <div className="absolute bottom-4 left-4 font-label text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 backdrop-blur-sm">
                 Studio Session
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
