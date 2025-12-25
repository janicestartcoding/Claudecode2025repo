const FloatingElements = () => {
  const crystals = [
    { size: 10, left: '10%', delay: 0, duration: 8 },
    { size: 15, left: '25%', delay: 2, duration: 10 },
    { size: 8, left: '50%', delay: 1, duration: 12 },
    { size: 12, left: '70%', delay: 3, duration: 9 },
    { size: 6, left: '85%', delay: 1.5, duration: 11 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {crystals.map((crystal, index) => (
        <div
          key={index}
          className="absolute top-0 opacity-20"
          style={{
            left: crystal.left,
            width: `${crystal.size}px`,
            height: `${crystal.size}px`,
            animation: `float ${crystal.duration}s ease-in-out infinite`,
            animationDelay: `${crystal.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-ice-400">
            <path d="M12 0l3 7h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

export default FloatingElements
