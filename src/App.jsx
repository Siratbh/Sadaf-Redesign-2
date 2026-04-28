import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import HomeV4 from './pages/HomeV4'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import PaintingDetail from './pages/PaintingDetail'
import About from './pages/About'
import Exhibitions from './pages/Exhibitions'
import Contact from './pages/Contact'
import CollectorsEdit from './pages/CollectorsEdit'

import { gsap } from 'gsap'

export default function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    // Remove is-light class on route change, let pages control it
    document.body.classList.remove('is-light')
    
    // Page routing transition
    gsap.fromTo('#page-transition-wrapper', 
      { opacity: 0, filter: 'blur(8px)', y: 20 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'filter,transform' }
    )
  }, [location.pathname])

  return (
    <>
      <CustomCursor />
      <Nav />
      <div id="page-transition-wrapper">
        <Routes>
          <Route path="/" element={<HomeV4 />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/paintings/:slug" element={<PaintingDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/collectors-edit" element={<CollectorsEdit />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
