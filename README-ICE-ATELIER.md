# An Ice Atelier

A visually stunning, immersive single-page website showcasing a transformative journey to Antarctica with a powerful message about dream-chasing and sustainability.

![An Ice Atelier](https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2940&auto=format&fit=crop)

## Features

### Design Elements
- **Premium, elegant aesthetic** with sophisticated UI components
- **Full-viewport hero section** with Antarctic landscape imagery
- **Parallax scrolling effects** creating depth and immersion
- **Bold typography** mixing Playfair Display (serif) and Inter (sans-serif)
- **Color palette**: Icy blues, pure whites, deep navy, and subtle silver accents
- **Generous white space** balanced with rich visual content

### Key Sections

1. **Hero Section**
   - Full-screen Antarctic landscape with parallax effect
   - Animated title "An Ice Atelier"
   - Smooth scroll indicator

2. **Journey Narrative**
   - Grid layout with alternating text and imagery
   - Three-part storytelling about the Antarctic expedition
   - Hover effects on images with smooth transitions

3. **Dream Chasing**
   - Inspirational section with pull quotes
   - Overlapping, rotating images with creative layouts
   - Three core principles: Vision, Action, Perseverance

4. **Sustainability Message**
   - Interactive tabbed infographics
   - Climate crisis data and statistics
   - Conservation timeline
   - Call-to-action for environmental awareness

5. **Visual Gallery**
   - Masonry-style image grid
   - Lightbox modal for full-size viewing
   - Hover transformations and overlays
   - 8 stunning Antarctic photographs

6. **Call to Action**
   - Elegant footer encouraging environmental action
   - Three action pillars: Take Action, Spread Awareness, Support Conservation
   - Link to World Wildlife Fund Antarctic conservation

### Interactive Elements
- Smooth scroll animations with Intersection Observer
- Image hover transformations (zoom, parallax)
- Animated navigation appearing on scroll
- Floating ice crystal particles
- Scroll progress indicator
- Responsive design for all devices

## Tech Stack

- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Custom animations** - Smooth transitions and effects
- **Responsive design** - Mobile-first approach

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Claudecode2025repo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Claudecode2025repo/
├── src/
│   ├── components/
│   │   ├── Hero.jsx              # Hero section with parallax
│   │   ├── Navigation.jsx        # Animated navigation bar
│   │   ├── JourneyNarrative.jsx  # Journey storytelling section
│   │   ├── DreamChasing.jsx      # Inspirational section
│   │   ├── Sustainability.jsx    # Climate data & conservation
│   │   ├── VisualGallery.jsx     # Image gallery with lightbox
│   │   ├── CallToAction.jsx      # Footer with CTA
│   │   ├── ScrollProgress.jsx    # Progress indicator
│   │   └── FloatingElements.jsx  # Decorative particles
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles & Tailwind
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind theme customization
├── postcss.config.js             # PostCSS configuration
└── package.json                  # Project dependencies

```

## Customization

### Colors
Edit `tailwind.config.js` to modify the color palette:
- `ice`: Light blue tones
- `navy`: Dark blue/black tones
- `silver`: Light gray tones

### Fonts
The project uses Google Fonts:
- **Playfair Display**: Headers (serif)
- **Inter**: Body text (sans-serif)

Change fonts in `src/index.css`

### Images
Replace Unsplash URLs in component files with your own Antarctic photography:
- Hero.jsx
- JourneyNarrative.jsx
- DreamChasing.jsx
- Sustainability.jsx
- VisualGallery.jsx

### Content
Edit the text content directly in each component file to personalize your story.

## Performance Optimizations

- Lazy loading images with native browser APIs
- CSS animations using GPU acceleration
- Optimized bundle with Vite code splitting
- Intersection Observer for scroll animations
- Minimal dependencies for faster load times

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Environmental Message

This website serves as both a showcase of Antarctic beauty and a call to action for climate conservation. Consider:
- Reducing your carbon footprint
- Supporting renewable energy initiatives
- Advocating for polar region protection
- Educating others about climate change

**Related Organizations:**
- [World Wildlife Fund - Antarctic](https://www.worldwildlife.org/places/antarctic)
- [Antarctic and Southern Ocean Coalition](https://www.asoc.org/)
- [Greenpeace Antarctic Campaign](https://www.greenpeace.org/international/tag/antarctic/)

## License

This project is open source and available under the MIT License.

## Credits

- Images: Unsplash photographers
- Design inspiration: Luxury magazine spreads and interactive art installations
- Built with passion for our planet's future

---

**An Ice Atelier** © 2025 | A Journey of Dreams & Sustainability

Created with care for our planet's future 🌍❄️
