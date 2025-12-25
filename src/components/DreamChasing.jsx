const DreamChasing = () => {
  const quotes = [
    {
      text: "Dreams don't work unless you do.",
      author: "The Antarctic Spirit"
    },
    {
      text: "The impossible is just the untried.",
      author: "Lessons from the Ice"
    }
  ]

  return (
    <section id="dreams" className="relative py-32 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-ice-200 to-ice-400" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-navy-900">
            Chase Your Dreams
          </h2>
          <div className="h-1 w-24 mx-auto bg-ice-400 mb-8" />
        </div>

        {/* Overlapping Images Section */}
        <div className="relative mb-32 animate-on-scroll">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2940&auto=format&fit=crop"
                alt="Antarctic Explorer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl transform md:translate-y-8 hover:translate-y-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2942&auto=format&fit=crop"
                alt="Adventure"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
                alt="Antarctic Landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Inspirational Text */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-2xl md:text-3xl font-light text-navy-700 leading-relaxed">
              Every great achievement begins with a single, audacious decision to try. Antarctica taught me that the barriers we face are often of our own making—mental constructs that dissolve when confronted with courage and determination.
            </p>
          </div>
        </div>

        {/* Pull Quotes */}
        <div className="grid md:grid-cols-2 gap-12 animate-on-scroll">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="relative p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <div className="absolute top-8 left-8 text-8xl text-ice-200 font-serif">"</div>
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-serif italic text-navy-900 mb-6">
                  {quote.text}
                </p>
                <p className="text-lg text-ice-400 font-sans">— {quote.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dream Principles */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 animate-on-scroll">
          {[
            {
              icon: "🎯",
              title: "Vision",
              description: "See beyond the horizon. Your dreams are valid, no matter how impossible they seem."
            },
            {
              icon: "⚡",
              title: "Action",
              description: "Transform intention into movement. Every small step forward compounds into extraordinary journeys."
            },
            {
              icon: "🌟",
              title: "Perseverance",
              description: "The ice doesn't melt in a day. Stay committed through the storms and the silence."
            }
          ].map((principle, index) => (
            <div
              key={index}
              className="text-center p-8 hover:bg-ice-100 rounded-xl transition-colors duration-300"
            >
              <div className="text-6xl mb-4">{principle.icon}</div>
              <h3 className="text-2xl font-serif font-bold text-navy-900 mb-4">
                {principle.title}
              </h3>
              <p className="text-lg text-navy-700 font-light">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DreamChasing
