import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Base defaults - 15% of 80px wrapper forms a nice 12px dot
    gsap.set(cursor, { scale: 0.15 })

    const xTo = gsap.quickTo(cursor, 'left', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'top', { duration: 0.4, ease: 'power3' })

    const onMouseMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    window.addEventListener('mousemove', onMouseMove)

    // General hover states
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, select, .hover-target')) {
        gsap.to(cursor, { scale: 0.25, duration: 0.3 })
      }
    }
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, input, textarea, select, .hover-target')) {
        // Gallery hover overrides
        if (!document.body.classList.contains('in-gallery-hover')) {
           gsap.to(cursor, { scale: 0.15, duration: 0.2 })
        }
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed top-0 left-0 w-20 h-20 bg-stone-300 rounded-full flex items-center justify-center z-[500] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ mixBlendMode: 'difference' }}
      id="cursor"
    >
      <span
        className="material-symbols-outlined text-black text-3xl opacity-0 transition-opacity duration-300"
        style={{ fontVariationSettings: "'wght' 300" }}
        id="cursor-icon"
      >
        arrow_forward
      </span>
    </div>
  )
}
