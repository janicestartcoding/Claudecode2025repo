import { useState } from 'react'

const Sustainability = () => {
  const [activeTab, setActiveTab] = useState('climate')

  const stats = {
    climate: [
      { value: "2°C", label: "Temperature Rise Threshold", description: "Critical warming limit to prevent catastrophic change" },
      { value: "89%", label: "Ice Sheet Loss", description: "West Antarctic ice sheet at risk this century" },
      { value: "3.3mm", label: "Annual Sea Rise", description: "Current rate of global sea level increase" }
    ],
    impact: [
      { value: "5.8M", label: "Square Miles", description: "Area of Antarctic ice sheet" },
      { value: "200ft", label: "Potential Rise", description: "Sea level impact if all Antarctic ice melted" },
      { value: "70%", label: "Fresh Water", description: "Percentage of Earth's freshwater in Antarctica" }
    ],
    action: [
      { value: "100%", label: "Renewable Goal", description: "Target for clean energy transition by 2050" },
      { value: "1.5°C", label: "Paris Agreement", description: "Ideal warming limit to preserve ice sheets" },
      { value: "0", label: "Carbon Emissions", description: "Net-zero target for global sustainability" }
    ]
  }

  return (
    <section id="sustainability" className="py-32 px-6 bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            Protecting Our <span className="text-gradient">Frozen Legacy</span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-ice-400 mb-8" />
          <p className="text-xl md:text-2xl text-ice-100 max-w-3xl mx-auto font-light">
            Antarctica is not just a destination—it's a barometer for our planet's health and a call to action
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="mb-16 animate-on-scroll">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'climate', label: 'Climate Crisis', icon: '🌡️' },
              { id: 'impact', label: 'Global Impact', icon: '🌍' },
              { id: 'action', label: 'Our Action', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-full text-lg font-sans transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-ice-400 text-navy-900 shadow-lg scale-105'
                    : 'bg-navy-800 text-ice-100 hover:bg-navy-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {stats[activeTab].map((stat, index) => (
              <div
                key={index}
                className="bg-navy-800 p-8 rounded-2xl border border-ice-400/20 hover:border-ice-400/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-6xl md:text-7xl font-bold text-ice-400 mb-4 font-serif">
                  {stat.value}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3 text-white">
                  {stat.label}
                </h3>
                <p className="text-ice-200 text-lg font-light">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conservation Message */}
        <div className="mt-32 animate-on-scroll">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1545173168-9f1947ebb3ae?q=80&w=2787&auto=format&fit=crop"
                alt="Melting Ice"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
            </div>

            <div className="space-y-6">
              <h3 className="text-4xl md:text-5xl font-serif font-bold">
                Every Action Matters
              </h3>
              <div className="h-px w-16 bg-ice-400" />
              <p className="text-xl text-ice-100 leading-relaxed font-light">
                The ice I witnessed in Antarctica has been forming for millennia. Yet it melts faster than ever before. We stand at a crossroads where individual choices compound into collective impact.
              </p>
              <ul className="space-y-4">
                {[
                  'Reduce carbon footprint through conscious consumption',
                  'Support renewable energy and sustainable practices',
                  'Advocate for policies protecting polar regions',
                  'Educate others about climate change realities'
                ].map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-ice-400 text-2xl">•</span>
                    <span className="text-lg text-ice-100">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="mt-32 animate-on-scroll">
          <h3 className="text-4xl font-serif font-bold text-center mb-16">
            The Melting Timeline
          </h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-ice-400/30" />

            <div className="space-y-16">
              {[
                { year: '1950s', event: 'Antarctic research stations established', trend: 'Baseline measurements begin' },
                { year: '1980s', event: 'First signs of ice shelf instability', trend: 'Warming detected' },
                { year: '2000s', event: 'Accelerated melting observed', trend: 'Tipping points approached' },
                { year: '2020s', event: 'Critical decade for action', trend: 'Last chance to reverse course' },
                { year: '2050', event: 'Make-or-break moment', trend: 'Net-zero emissions target' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <h4 className="text-3xl font-serif font-bold text-ice-400 mb-2">{item.year}</h4>
                    <p className="text-xl text-white mb-1">{item.event}</p>
                    <p className="text-lg text-ice-200 font-light">{item.trend}</p>
                  </div>

                  <div className="w-6 h-6 bg-ice-400 rounded-full border-4 border-navy-900 z-10" />

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sustainability
