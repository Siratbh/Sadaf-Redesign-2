import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

let globalLenis = null

export function getLenis() {
  return globalLenis
}

export default function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    })

    globalLenis = lenis
    lenisRef.current = lenis
    window.lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      globalLenis = null
      window.lenis = null
    }
  }, [])

  return lenisRef
}
