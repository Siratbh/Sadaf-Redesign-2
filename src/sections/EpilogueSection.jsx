import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InquiryPanel from '../components/InquiryPanel'

gsap.registerPlugin(ScrollTrigger)

export default function EpilogueSection() {
  const [panelOpen, setPanelOpen] = useState(false)
  const bgTextRef = useRef(null)

  useEffect(() => {
    if (!bgTextRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(bgTextRef.current, {
        scrollTrigger: {
          trigger: '#epilogue-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        x: '15%',
        ease: 'none',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <InquiryPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

      <section
        className="relative h-[80vh] md:h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-surface-container-lowest"
        id="epilogue-section"
      >
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden select-none">
          <div
            ref={bgTextRef}
            className="parallax-text font-headline text-[40vw] md:text-[25vw] leading-none text-on-surface italic -translate-x-[10%]"
          >
            INQUIRE
          </div>
        </div>

        <div className="relative z-10 text-center flex flex-col items-center gap-8 md:gap-12 px-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-on-surface-variant reveal-item">
            Availability &amp; Acquisition
          </span>

          <button
            className="group relative block overflow-hidden"
            onClick={() => setPanelOpen(true)}
          >
            <h2 className="font-headline text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-tighter text-on-surface transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:italic group-hover:scale-105">
              INQUIRE
            </h2>
            <div className="h-px w-0 bg-on-surface mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full mt-4" />
          </button>

          <p className="font-body text-sm md:text-base text-on-surface-variant font-light max-w-xs md:max-w-sm mx-auto leading-relaxed reveal-item">
            For private viewings, institutional loans, and digital catalog requests.
          </p>
        </div>

        <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 font-label text-[10px] uppercase tracking-[0.4em] text-outline-variant">
          Fin.
        </div>
      </section>
    </>
  )
}
