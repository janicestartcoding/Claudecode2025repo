import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Navigation from './components/Navigation'
import JourneyNarrative from './components/JourneyNarrative'
import DreamChasing from './components/DreamChasing'
import Sustainability from './components/Sustainability'
import VisualGallery from './components/VisualGallery'
import CallToAction from './components/CallToAction'
import ScrollProgress from './components/ScrollProgress'
import FloatingElements from './components/FloatingElements'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll('.animate-on-scroll')
    animateElements.forEach(el => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="relative">
      <Navigation scrollY={scrollY} />
      <ScrollProgress />
      <FloatingElements />

      <Hero scrollY={scrollY} />
      <JourneyNarrative />
      <DreamChasing />
      <Sustainability />
      <VisualGallery />
      <CallToAction />
    </div>
  )
}

export default App
