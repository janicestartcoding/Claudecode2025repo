import { useEffect, useState } from 'react'

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / scrollTotal) * 100
      setProgress(currentProgress)
    }

    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-ice-100">
      <div
        className="h-full bg-gradient-to-r from-ice-400 to-navy-900 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ScrollProgress
