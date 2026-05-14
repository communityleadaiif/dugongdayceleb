import { useMemo } from 'react'
import './BubbleOverlay.css'

export default function BubbleOverlay() {
  const bubbles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 12,
      delay: Math.random() * 15,
      duration: 8 + Math.random() * 12,
      wobbleAmp: 10 + Math.random() * 30,
    }))
  }, [])

  return (
    <div className="bubble-overlay">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            '--wobble-amp': `${b.wobbleAmp}px`,
          }}
        />
      ))}
    </div>
  )
}
