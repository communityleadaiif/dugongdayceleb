import { useState, useEffect } from 'react'
import './SwimmingFish.css'

const fishTypes = [
  { emoji: '🐟', size: 24, speed: 15, y: 10 },
  { emoji: '🐠', size: 28, speed: 20, y: 25 },
  { emoji: '🐡', size: 22, speed: 25, y: 45 },
  { emoji: '🦈', size: 32, speed: 18, y: 60 },
  { emoji: '🐙', size: 26, speed: 30, y: 75 },
  { emoji: '🦑', size: 24, speed: 22, y: 85 },
  { emoji: '🐢', size: 30, speed: 35, y: 35 },
  { emoji: '🐬', size: 34, speed: 12, y: 50 },
  { emoji: '🐋', size: 40, speed: 40, y: 70 },
  { emoji: '🦀', size: 20, speed: 28, y: 90 },
]

export default function SwimmingFish() {
  const [fish, setFish] = useState([])

  useEffect(() => {
    // Spawn fish periodically
    const spawn = () => {
      const type = fishTypes[Math.floor(Math.random() * fishTypes.length)]
      const direction = Math.random() > 0.5 ? 'left' : 'right'
      const id = Date.now() + Math.random()
      const yOffset = type.y + (Math.random() - 0.5) * 15
      const speed = type.speed + Math.random() * 10

      setFish(prev => [...prev.slice(-8), { // Keep max 8 fish
        id,
        ...type,
        direction,
        y: yOffset,
        speed,
      }])

      // Remove after animation completes
      setTimeout(() => {
        setFish(prev => prev.filter(f => f.id !== id))
      }, speed * 1000)
    }

    // Initial spawn
    for (let i = 0; i < 3; i++) {
      setTimeout(spawn, i * 2000)
    }

    // Periodic spawn
    const interval = setInterval(spawn, 4000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="swimming-fish-layer">
      {fish.map(f => (
        <div
          key={f.id}
          className={`swimming-fish swimming-fish--${f.direction}`}
          style={{
            top: `${f.y}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.speed}s`,
          }}
        >
          {f.emoji}
        </div>
      ))}
    </div>
  )
}
