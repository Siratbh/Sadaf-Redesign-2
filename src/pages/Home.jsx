import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GallerySection from '../sections/GallerySection'
import ManifestoSection from '../sections/ManifestoSection'
import PersonaSection from '../sections/PersonaSection'
import ArchiveSection from '../sections/ArchiveSection'
import EpilogueSection from '../sections/EpilogueSection'
import SEOHead from '../components/SEOHead'
import useLenis from '../hooks/useLenis'
import { getFeaturedPaintings, getExhibitions, getPage } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

// Fallback artworks so the WebGL section always renders
const FALLBACK_ARTWORKS = [
  { title: 'Nocturnal Whispers', medium: 'Oil on Canvas', year: '2024', featured_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80', slug: 'nocturnal-whispers' },
  { title: 'Architectural Void', medium: 'Mixed Media', year: '2023', featured_image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80', slug: 'architectural-void' },
  { title: 'The Silent Observer', medium: 'Oil on Canvas', year: '2024', featured_image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80', slug: 'the-silent-observer' },
  { title: 'Blood & Iron', medium: 'Acrylic on Wood', year: '2022', featured_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80', slug: 'blood-and-iron' },
  { title: 'Ethereal Shadows', medium: 'Watercolor', year: '2024', featured_image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80', slug: 'ethereal-shadows' },
  { title: 'Metropolitan Pulse', medium: 'Oil on Canvas', year: '2023', featured_image: 'https://images.unsplash.com/photo-1506815442541-b3b3a4a15a81?auto=format&fit=crop&q=80', slug: 'metropolitan-pulse' },
  { title: 'Fading Memories', medium: 'Mixed Media', year: '2021', featured_image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80', slug: 'fading-memories' },
  { title: 'Crimson Tide', medium: 'Acrylic', year: '2024', featured_image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80', slug: 'crimson-tide' },
]

export default function Home() {
  useLenis()

  let artworks = []
  let exhibitions = []
  let about = null
  try {
    artworks = getFeaturedPaintings()
    exhibitions = getExhibitions()
    about = getPage('home-artist')
  } catch (e) {
    artworks = FALLBACK_ARTWORKS
  }

  if (!artworks || artworks.length === 0) {
    artworks = FALLBACK_ARTWORKS
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations
      gsap.utils.toArray('.reveal-item').forEach(item => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          y: 30,
          opacity: 0,
          duration: 1.0,
          ease: 'power2.out',
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <SEOHead />
      <GallerySection artworks={artworks} />
      <ManifestoSection />
      <PersonaSection about={about} />
      <ArchiveSection exhibitions={exhibitions} />
      <EpilogueSection />
    </>
  )
}
