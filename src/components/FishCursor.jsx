import { useEffect, useRef, useState } from 'react'

export default function FishCursor() {
  const cursorRef = useRef(null)
  const trailRef = useRef([])
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const velocity = useRef({ x: 0, y: 0 })
  const [bubbles, setBubbles] = useState([])
  const bubbleId = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const handleClick = (e) => {
      // Spawn bubbles on click
      const newBubbles = []
      for (let i = 0; i < 5; i++) {
        newBubbles.push({
          id: bubbleId.current++,
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          size: 4 + Math.random() * 8,
          created: Date.now()
        })
      }
      setBubbles(prev => [...prev, ...newBubbles])
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => Date.now() - b.created < 1500))
      }, 1600)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    let animFrame
    const animate = () => {
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y

      velocity.current.x += dx * 0.08
      velocity.current.y += dy * 0.08
      velocity.current.x *= 0.85
      velocity.current.y *= 0.85

      pos.current.x += velocity.current.x
      pos.current.y += velocity.current.y

      // Calculate angle for fish direction
      const angle = Math.atan2(velocity.current.y, velocity.current.x)
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2)
      const isMovingLeft = velocity.current.x < -0.5

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 16}px, ${pos.current.y - 10}px) rotate(${angle}rad) scaleX(${isMovingLeft ? -1 : 1})`
        // Tail wiggle based on speed
        const tailEl = cursorRef.current.querySelector('.fish-tail')
        if (tailEl) {
          tailEl.style.transform = `rotate(${Math.sin(Date.now() * 0.01) * (10 + speed * 2)}deg)`
        }
      }

      // Update trail bubbles
      trailRef.current.forEach((el, i) => {
        if (el) {
          const delay = (i + 1) * 3
          const trailX = pos.current.x - velocity.current.x * delay * 0.3
          const trailY = pos.current.y - velocity.current.y * delay * 0.3 + Math.sin(Date.now() * 0.003 + i) * 3
          el.style.transform = `translate(${trailX - 3}px, ${trailY - 3}px)`
          el.style.opacity = (1 - i * 0.15) * 0.4
        }
      })

      animFrame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <>
      {/* Trail bubbles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={el => trailRef.current[i] = el}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 6 - i * 0.5,
            height: 6 - i * 0.5,
            borderRadius: '50%',
            background: 'rgba(144, 224, 239, 0.3)',
            pointerEvents: 'none',
            zIndex: 99998,
            transition: 'opacity 0.3s',
          }}
        />
      ))}

      {/* Fish cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fish body */}
          <ellipse cx="18" cy="10" rx="10" ry="6" fill="url(#fishGrad)" />
          {/* Tail */}
          <path className="fish-tail" d="M4 10 L0 3 L8 10 L0 17 Z" fill="url(#tailGrad)" style={{ transformOrigin: '8px 10px', transition: 'transform 0.05s' }} />
          {/* Eye */}
          <circle cx="23" cy="8" r="2.5" fill="white" />
          <circle cx="24" cy="7.5" r="1.2" fill="#001d3d" />
          <circle cx="24.5" cy="7" r="0.5" fill="white" />
          {/* Dorsal fin */}
          <path d="M14 4 L18 1 L20 4" fill="rgba(0,245,212,0.6)" />
          {/* Pectoral fin */}
          <path d="M16 12 L14 16 L19 13" fill="rgba(0,180,216,0.5)" />
          {/* Mouth line */}
          <path d="M27 10 Q28 10.5 27 11" stroke="rgba(0,30,61,0.4)" strokeWidth="0.5" fill="none" />
          {/* Glow */}
          <ellipse cx="18" cy="10" rx="12" ry="8" fill="url(#fishGlow)" />
          <defs>
            <radialGradient id="fishGrad">
              <stop offset="0%" stopColor="#00f5d4" />
              <stop offset="60%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#0077b6" />
            </radialGradient>
            <linearGradient id="tailGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0077b6" />
              <stop offset="100%" stopColor="#00b4d8" />
            </linearGradient>
            <radialGradient id="fishGlow">
              <stop offset="0%" stopColor="rgba(0,245,212,0.15)" />
              <stop offset="100%" stopColor="rgba(0,245,212,0)" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Click bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'fixed',
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            border: '1px solid rgba(144, 224, 239, 0.5)',
            background: 'rgba(144, 224, 239, 0.15)',
            pointerEvents: 'none',
            zIndex: 99997,
            animation: 'bubble-cursor-rise 1.5s ease-out forwards',
          }}
        />
      ))}

      <style>{`
        @keyframes bubble-cursor-rise {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-60px) scale(0.3); opacity: 0; }
        }
      `}</style>
    </>
  )
}
