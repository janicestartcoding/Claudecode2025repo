const CallToAction = () => {
  return (
    <section id="action" className="relative py-32 px-6 bg-navy-900 text-white overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ice-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ice-200 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="animate-on-scroll">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">
            Be Part of the <span className="text-gradient">Solution</span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-ice-400 mb-12" />

          <p className="text-2xl md:text-3xl font-light mb-12 leading-relaxed text-ice-100">
            Antarctica showed me that individual actions ripple across the planet. Your choices today shape tomorrow's world.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '🌱',
                title: 'Take Action',
                description: 'Reduce your carbon footprint starting today'
              },
              {
                icon: '📢',
                title: 'Spread Awareness',
                description: 'Share the urgency of climate action'
              },
              {
                icon: '💚',
                title: 'Support Conservation',
                description: 'Back organizations protecting polar regions'
              }
            ].map((action, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-navy-800/50 border border-ice-400/20 hover:border-ice-400/50 hover:bg-navy-800 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{action.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-3">{action.title}</h3>
                <p className="text-ice-200 font-light">{action.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <a
              href="https://www.worldwildlife.org/places/antarctic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-5 bg-ice-400 text-navy-900 text-lg font-sans font-semibold rounded-full hover:bg-ice-300 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Learn More About Conservation
            </a>

            <p className="text-ice-300 text-sm font-light">
              Together, we can preserve the frozen beauty for generations to come
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-32 pt-12 border-t border-ice-400/20 text-center">
        <p className="text-ice-300 font-light mb-4">
          An Ice Atelier © 2025 | A Journey of Dreams & Sustainability
        </p>
        <p className="text-ice-400/60 text-sm">
          Created with care for our planet's future
        </p>
      </div>
    </section>
  )
}

export default CallToAction
