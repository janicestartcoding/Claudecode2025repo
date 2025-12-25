import { useEffect, useState } from 'react'

const Hero = ({ scrollY }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const parallaxOffset = scrollY * 0.5

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2940&auto=format&fit=crop')`,
          transform: `translateY(${parallaxOffset}px)`,
          scale: '1.1'
        }}
      >
        <div className="absolute inset-0 gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-white">
        <div className={`text-center transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">
            An Ice <span className="text-gradient">Atelier</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8 max-w-3xl mx-auto tracking-wide">
            A Journey to the Edge of Dreams
          </p>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-ice-200 to-transparent" />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-sm uppercase tracking-widest font-sans">Scroll to Explore</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
