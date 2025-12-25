import { useState } from 'react'

const VisualGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  const images = [
    {
      url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2940&auto=format&fit=crop",
      title: "Aurora Australis",
      description: "The southern lights dance above Antarctic ice"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop",
      title: "Endless Horizons",
      description: "Where sky meets ice in perfect harmony"
    },
    {
      url: "https://images.unsplash.com/photo-1457269449834-928af64c684d?q=80&w=2874&auto=format&fit=crop",
      title: "Glacier Fields",
      description: "Ancient ice formations sculpted by time"
    },
    {
      url: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=2874&auto=format&fit=crop",
      title: "Penguin Colonies",
      description: "Life thrives in the harshest conditions"
    },
    {
      url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2940&auto=format&fit=crop",
      title: "Icebergs",
      description: "Floating monuments of frozen time"
    },
    {
      url: "https://images.unsplash.com/photo-1545173168-9f1947ebb3ae?q=80&w=2787&auto=format&fit=crop",
      title: "Melting Beauty",
      description: "Fragile crystalline structures under threat"
    },
    {
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2942&auto=format&fit=crop",
      title: "The Journey",
      description: "Paths carved through pristine wilderness"
    },
    {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop",
      title: "Mountain Peaks",
      description: "Majestic summits rise from frozen seas"
    }
  ]

  return (
    <section id="gallery" className="py-32 px-6 bg-gradient-to-b from-ice-100 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-navy-900">
            Visual Gallery
          </h2>
          <div className="h-1 w-24 mx-auto bg-ice-400 mb-8" />
          <p className="text-xl md:text-2xl text-navy-700 max-w-3xl mx-auto font-light">
            Captured moments from the world's last great wilderness
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
                index % 3 === 0 ? 'md:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.title}
                className={`w-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${
                  index % 3 === 0 ? 'h-[600px]' : 'h-[300px]'
                }`}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {image.title}
                </h3>
                <p className="text-ice-200 text-lg">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 backdrop-blur-sm p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-ice-400 transition-colors"
            >
              ×
            </button>

            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />

            <div className="mt-6 text-center">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-xl text-ice-200">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default VisualGallery
