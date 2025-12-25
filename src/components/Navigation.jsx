import { useState, useEffect } from 'react'

const Navigation = ({ scrollY }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(scrollY > 100)
  }, [scrollY])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="glass-effect backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection('home')}
              className="text-xl font-serif font-bold text-navy-900"
            >
              An Ice Atelier
            </button>

            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'journey', label: 'Journey' },
                { id: 'dreams', label: 'Dreams' },
                { id: 'sustainability', label: 'Sustainability' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'action', label: 'Take Action' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-sans uppercase tracking-wider text-navy-900 hover:text-ice-400 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
