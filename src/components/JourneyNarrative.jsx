const JourneyNarrative = () => {
  const journeyStories = [
    {
      title: "The Call of the Frozen South",
      description: "It began with a whisper—a pull toward the most remote continent on Earth. Antarctica, a land of extremes, where silence speaks louder than words and the horizon stretches into infinity. This wasn't just a journey; it was a pilgrimage to understand what it means to chase a dream against all odds.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
    },
    {
      title: "Embracing the Unknown",
      description: "Stepping onto Antarctic ice felt like entering another world. The vast white expanse challenged every preconception, every comfort zone. Here, nature reigns supreme, indifferent to human ambition yet profoundly inspiring. Each day brought new revelations about resilience, adaptation, and the raw beauty of our planet.",
      image: "https://images.unsplash.com/photo-1457269449834-928af64c684d?q=80&w=2874&auto=format&fit=crop"
    },
    {
      title: "Lessons from the Ice",
      description: "Antarctica teaches through silence and scale. The glaciers, ancient and slow, remind us that true transformation takes time. The wildlife, thriving in impossible conditions, shows that life finds a way. This frozen atelier became my classroom, teaching lessons about persistence, humility, and the interconnectedness of all things.",
      image: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=2874&auto=format&fit=crop"
    }
  ]

  return (
    <section id="journey" className="py-32 px-6 bg-gradient-to-b from-white to-ice-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-navy-900">
            The Journey
          </h2>
          <div className="h-1 w-24 mx-auto bg-ice-400 mb-8" />
          <p className="text-xl md:text-2xl text-navy-700 max-w-3xl mx-auto font-light">
            A transformative expedition to the edge of the world, where ice meets inspiration
          </p>
        </div>

        {/* Story Grid */}
        <div className="space-y-32">
          {journeyStories.map((story, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center animate-on-scroll ${
                index % 2 === 1 ? 'md:grid-flow-dense' : ''
              }`}
            >
              <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              <div className={`${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <div className="space-y-6">
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-navy-900">
                    {story.title}
                  </h3>
                  <div className="h-px w-16 bg-ice-400" />
                  <p className="text-lg md:text-xl text-navy-700 leading-relaxed font-light">
                    {story.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default JourneyNarrative
