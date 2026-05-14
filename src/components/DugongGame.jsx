import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './DugongGame.css'

export default function DugongGame() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const canvasRef = useRef(null)

  // Game States
  const [gameState, setGameState] = useState('start') // 'start' | 'playing' | 'gameover'
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Audio Context Ref (initialized on user interaction)
  const audioCtxRef = useRef(null)

  // Load Highscore
  useEffect(() => {
    const saved = localStorage.getItem('ok2026_dugong_highscore')
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  // Update Highscore
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('ok2026_dugong_highscore', score.toString())
    }
  }, [score, highScore])

  // Play retro synthesized sound effects via Web Audio API
  const playSound = (type) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      const now = ctx.currentTime

      if (type === 'swim') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(150, now)
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.linearRampToValueAtTime(0, now + 0.12)
        osc.start(now)
        osc.stop(now + 0.12)
      } else if (type === 'hit') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(120, now)
        osc.frequency.linearRampToValueAtTime(40, now + 0.25)
        gain.gain.setValueAtTime(0.25, now)
        gain.gain.linearRampToValueAtTime(0, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      } else if (type === 'point') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, now) // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.linearRampToValueAtTime(0, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      }
    } catch (e) {
      // Audio context might be blocked if not fully interacted
    }
  }

  // Input Controller
  const handleSwim = () => {
    if (gameState === 'playing') {
      playSound('swim')
    } else if (gameState === 'start' || gameState === 'gameover') {
      setGameState('playing')
      setScore(0)
    }
  }

  // Core Game Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Handle high-DPI scaling dynamically mapping logical metrics
    const dpr = window.devicePixelRatio || 1
    const cw = canvas.clientWidth || 800
    const ch = canvas.clientHeight || 320

    canvas.width = cw * dpr
    canvas.height = ch * dpr
    ctx.scale(dpr, dpr)

    let animationFrameId
    let isGameRunning = gameState === 'playing'

    // Game variables
    let currentScore = 0
    let frameCount = 0
    let floraOffset = 0 // Parallax offset for bottom green seaweed

    // Dugong state
    const dugong = {
      x: 80,
      y: ch / 2,
      w: 48,
      h: 24,
      vy: 0,
      gravity: 0.38,
      jumpPower: -6.5,
      maxFall: 7,
    }

    // Dynamic swim integration triggered by react state callback scope mapping
    const performSwimImpulse = () => {
      if (isGameRunning) {
        dugong.vy = dugong.jumpPower
        playSound('swim')
      }
    }

    // Attach local input event listener callback cleanly
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (gameState === 'playing') {
          performSwimImpulse()
        } else {
          setGameState('playing')
          setScore(0)
        }
      }
    }

    // Touch/click directly on canvas triggers swimming without preventing page scroll on mobile unless actively playing
    const handleCanvasTouch = (e) => {
      if (gameState === 'playing') {
        e.preventDefault() // Only lock scrolling when active gameplay is happening
        performSwimImpulse()
      }
    }

    // Expose dynamic imperative callback handler onto window object scoped to this canvas for external tap triggers
    canvas.performSwimImpulse = performSwimImpulse

    // Obstacles array
    let obstacles = []
    let baseSpeed = 4.5
    let spawnTimer = 0
    let spawnInterval = 85 // Frames between spawns

    // Floating bubble particles for deep sea feel
    let particles = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
    }))

    // Helper to draw custom pixel art blocks
    const drawPixelDugong = (x, y) => {
      ctx.save()
      ctx.translate(x, y)

      // Slight rotation based on vertical velocity
      const angle = Math.min(Math.max(dugong.vy * 0.05, -0.3), 0.4)
      ctx.rotate(angle)

      const s = 4 // Pixel scale factor

      // Tail Fluke (left side)
      ctx.fillStyle = '#64748b'
      ctx.fillRect(-3 * s, 0 * s, 3 * s, 6 * s)
      ctx.fillStyle = '#475569'
      ctx.fillRect(-4 * s, -1 * s, 2 * s, 8 * s)

      // Main Body
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(0 * s, 0 * s, 8 * s, 5 * s)
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(1 * s, 1 * s, 7 * s, 3 * s) // Highlight
      ctx.fillStyle = '#64748b'
      ctx.fillRect(0 * s, 4 * s, 8 * s, 2 * s) // Belly shadow

      // Head / Snout
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(8 * s, 1 * s, 3 * s, 4 * s)
      ctx.fillStyle = '#64748b'
      ctx.fillRect(10 * s, 3 * s, 2 * s, 3 * s) // Curved snout

      // Eye
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(8.5 * s, 1.5 * s, 1.5 * s, 1.5 * s)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(9 * s, 2 * s, 1 * s, 1 * s)

      // Flipper
      ctx.fillStyle = '#475569'
      ctx.fillRect(4 * s, 4 * s, 2 * s, 3 * s)
      ctx.fillRect(3 * s, 5 * s, 2 * s, 2 * s)

      ctx.restore()
    }

    // Helper to draw pixel art Obstacle
    const drawPixelObstacle = (obs) => {
      ctx.save()
      ctx.translate(obs.x, obs.y)
      const s = 3 // Pixel scale

      if (obs.type === 'mine') {
        // Red Spiky Sea Mine
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(2 * s, 2 * s, 6 * s, 6 * s)
        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(3 * s, 3 * s, 4 * s, 4 * s)
        // Spikes
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(4 * s, 0, 2 * s, 2 * s) // Top
        ctx.fillRect(4 * s, 8 * s, 2 * s, 2 * s) // Bottom
        ctx.fillRect(0, 4 * s, 2 * s, 2 * s) // Left
        ctx.fillRect(8 * s, 4 * s, 2 * s, 2 * s) // Right
      } else if (obs.type === 'anchor') {
        // Iron Anchor
        ctx.fillStyle = '#334155'
        ctx.fillRect(4 * s, 0, 2 * s, 10 * s) // Shank
        ctx.fillRect(2 * s, 1 * s, 6 * s, 2 * s) // Stock
        // Crown & Arms
        ctx.fillRect(1 * s, 8 * s, 8 * s, 2 * s)
        ctx.fillRect(0, 6 * s, 2 * s, 3 * s)
        ctx.fillRect(8 * s, 6 * s, 2 * s, 3 * s)
      } else if (obs.type === 'waste') {
        // Toxic Net / Waste
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(0, 0, 8 * s, 4 * s)
        ctx.fillStyle = '#15803d'
        ctx.fillRect(1 * s, 1 * s, 6 * s, 2 * s)
        ctx.fillStyle = '#86efac'
        ctx.fillRect(2 * s, 4 * s, 2 * s, 3 * s) // Dripping waste
      } else if (obs.type === 'ghostnet') {
        // Drifting Ghost Net
        ctx.fillStyle = 'rgba(203, 213, 225, 0.55)'
        ctx.fillRect(0, 0, 10 * s, 10 * s)
        ctx.fillStyle = '#94a3b8'
        ctx.fillRect(0, 2 * s, 10 * s, 1 * s)
        ctx.fillRect(0, 7 * s, 10 * s, 1 * s)
        ctx.fillRect(2 * s, 0, 1 * s, 10 * s)
        ctx.fillRect(7 * s, 0, 1 * s, 10 * s)
        // Entangled red debris node
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(4 * s, 4 * s, 2 * s, 2 * s)
      } else if (obs.type === 'plasticbag') {
        // Translucent Plastic Bag / Bottle
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)'
        ctx.fillRect(1 * s, 2 * s, 6 * s, 5 * s)
        // Handles
        ctx.fillRect(1 * s, 0, 1.5 * s, 2 * s)
        ctx.fillRect(5.5 * s, 0, 1.5 * s, 2 * s)
        // Inside white shimmer highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.fillRect(2 * s, 3 * s, 2 * s, 3 * s)
      }

      ctx.restore()
    }

    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('mousedown', handleCanvasTouch)
    canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false })

    // Render Game Loop
    const gameLoop = () => {
      // Clear Background
      ctx.fillStyle = '#000814'
      ctx.fillRect(0, 0, cw, ch)

      // Draw subtle ambient grid/layers
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.03)'
      ctx.lineWidth = 1
      for (let i = 0; i < cw; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, ch)
        ctx.stroke()
      }

      // Update & Draw Background Particles
      ctx.fillStyle = 'rgba(144, 224, 239, 0.4)'
      particles.forEach((p) => {
        p.x -= p.speed
        if (p.x < 0) {
          p.x = cw
          p.y = Math.random() * ch
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Calculate active speed scaling
      const activeSpeed = baseSpeed + Math.floor(currentScore / 250) * 0.6

      if (isGameRunning) {
        frameCount++
        floraOffset = (floraOffset + activeSpeed * 0.4) % 40

        // Increment Score smoothly
        if (frameCount % 6 === 0) {
          currentScore += 1
          setScore(currentScore)
          if (currentScore > 0 && currentScore % 100 === 0) {
            playSound('point')
          }
        }

        // Apply Dugong Physics
        dugong.vy += dugong.gravity
        if (dugong.vy > dugong.maxFall) dugong.vy = dugong.maxFall
        dugong.y += dugong.vy

        // Floor / Roof bounds constraint
        if (dugong.y < 12) {
          dugong.y = 12
          dugong.vy = 0
        }
        if (dugong.y > ch - dugong.h - 14) {
          dugong.y = ch - dugong.h - 14
          dugong.vy = 0
        }

        // Obstacle Spawning Logic
        spawnTimer++
        // Dynamic spawn frequency based on score
        const activeSpawnInterval = Math.max(spawnInterval - Math.floor(currentScore / 200) * 4, 40)

        if (spawnTimer >= activeSpawnInterval) {
          spawnTimer = 0
          const types = ['mine', 'anchor', 'waste', 'ghostnet', 'plasticbag']
          const randomType = types[Math.floor(Math.random() * types.length)]
          
          let obsY = Math.random() * (ch - 110) + 25
          let obsW = 30
          let obsH = 24

          if (randomType === 'anchor') {
            obsY = ch - 44 // Bottom anchored directly on the seabed
            obsH = 30
          } else if (randomType === 'waste') {
            obsY = Math.random() * 45 + 15 // High up floating
          } else if (randomType === 'ghostnet') {
            obsW = 30
            obsH = 30
          } else if (randomType === 'plasticbag') {
            obsW = 24
            obsH = 21
          }

          obstacles.push({
            x: cw,
            y: obsY,
            w: obsW,
            h: obsH,
            type: randomType,
            passed: false,
          })
        }

        // Update & Draw Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i]
          obs.x -= activeSpeed

          // Check passing bonus points
          if (!obs.passed && obs.x + obs.w < dugong.x) {
            obs.passed = true
            currentScore += 5
            setScore(currentScore)
          }

          // Check Collision bounding boxes
          if (
            dugong.x < obs.x + obs.w &&
            dugong.x + dugong.w > obs.x &&
            dugong.y < obs.y + obs.h &&
            dugong.y + dugong.h > obs.y
          ) {
            // Collision Detected!
            playSound('hit')
            setGameState('gameover')
            isGameRunning = false
            break
          }

          // Remove off-screen obstacles
          if (obs.x + obs.w < 0) {
            obstacles.splice(i, 1)
          } else {
            drawPixelObstacle(obs)
          }
        }
      } else {
        // Draw resting frame obstacles if paused/gameover
        obstacles.forEach(drawPixelObstacle)
      }

      // Render Base Bottom Sea Floor
      ctx.fillStyle = '#001d3d'
      ctx.fillRect(0, ch - 14, cw, 14)

      // Render Swaying & Scrolling Green Seaweed Floor (The Greens!)
      ctx.save()
      const sway = Math.sin(frameCount * 0.08) * 4
      for (let x = -floraOffset; x < cw; x += 40) {
        // Deep Green Kelp Strand
        ctx.fillStyle = '#15803d'
        ctx.fillRect(x + sway, ch - 34, 6, 22)
        ctx.fillStyle = '#16a34a'
        ctx.fillRect(x + sway + 1, ch - 44, 4, 10) // Light tip

        // Bright Lime Flora Clump
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(x + 18 - sway * 0.5, ch - 24, 5, 12)
        ctx.fillStyle = '#4ade80'
        ctx.fillRect(x + 19 - sway * 0.5, ch - 30, 3, 6)
      }
      ctx.restore()

      // Render Cavern Roof Border
      ctx.fillStyle = '#001226'
      ctx.fillRect(0, 0, cw, 10)

      // Render Dugong Avatar
      drawPixelDugong(dugong.x, dugong.y)

      // Loop execution
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    // Start execution loop
    animationFrameId = requestAnimationFrame(gameLoop)

    // Cleanup phase
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      if (canvas) {
        canvas.removeEventListener('mousedown', handleCanvasTouch)
        canvas.removeEventListener('touchstart', handleCanvasTouch)
      }
    }
  }, [gameState])

  return (
    <section id="game" className="section arcade-section" ref={sectionRef}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          className="text-center arcade__header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge badge--pixel">🎮 Deep Sea Arcade</span>
          <h2 className="arcade__title">Dugong Deep Sea Run</h2>
          <p className="arcade__subtitle">
            Guide the Sea Cow safely through underground/underwater channels! Avoid sea mines, anchors, and debris.
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* Console Display Screen */}
        <motion.div
          className="arcade__console glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Top Scorebar Indicator */}
          <div className="arcade__scorebar">
            <div className="arcade__score-box">
              <span className="arcade__score-label">CURRENT SCORE</span>
              <span className="arcade__score-digits">{score.toString().padStart(5, '0')}</span>
            </div>
            <div className="arcade__score-box arcade__score-box--high">
              <span className="arcade__score-label">TOP RECORD</span>
              <span className="arcade__score-digits">{highScore.toString().padStart(5, '0')}</span>
            </div>
          </div>

          {/* HTML5 Render Canvas Frame */}
          <div className="arcade__canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="arcade__canvas"
            />

            {/* Retro Screens Overlays */}
            {gameState === 'start' && (
              <div className="arcade__overlay">
                <div className="arcade__pixel-badge">READY PLAYER ONE</div>
                <h3>Dugong Sub-Surface Run</h3>
                <p>Press <strong>SPACEBAR</strong> or <strong>TAP SCREEN</strong> to Swim Upwards</p>
                <button
                  className="btn btn-primary arcade__pixel-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setGameState('playing')
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    setGameState('playing')
                  }}
                >
                  🚀 START SWIMMING
                </button>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="arcade__overlay arcade__overlay--gameover">
                <div className="arcade__pixel-badge arcade__pixel-badge--danger">MISSION OVER</div>
                <h3>Hazard Collided</h3>
                <p>Final Score Recorded: <strong>{score}</strong> Points</p>
                {score === highScore && score > 0 && (
                  <div className="arcade__new-record animate-glow">
                    🏆 NEW WEBSITE ALL-TIME RECORD!
                  </div>
                )}
                <button
                  className="btn btn-gold arcade__pixel-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setGameState('playing')
                    setScore(0)
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    setGameState('playing')
                    setScore(0)
                  }}
                >
                  🔄 RETRY DIVE
                </button>
              </div>
            )}
          </div>

          {/* Dedicated Mobile Control Tap Bar (Highly accessible for thumbs on mobile viewports) */}
          {gameState === 'playing' && (
            <div className="arcade__mobile-controls">
              <motion.button
                className="btn btn-primary arcade__mobile-btn"
                onClick={(e) => {
                  e.preventDefault()
                  if (canvasRef.current?.performSwimImpulse) {
                    canvasRef.current.performSwimImpulse()
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  if (canvasRef.current?.performSwimImpulse) {
                    canvasRef.current.performSwimImpulse()
                  }
                }}
                whileTap={{ scale: 0.96 }}
              >
                👆 TAP HERE TO SWIM UP
              </motion.button>
            </div>
          )}

          {/* Bottom Guidelines Prompt */}
          <div className="arcade__controls-footer">
            <div className="arcade__control-item">
              <span className="arcade__pixel-key">SPACEBAR</span> / <span className="arcade__pixel-key">TAP</span> = Swim Up
            </div>
            <div className="arcade__control-item">
              <span className="arcade__pixel-icon">🔴</span> = Sea Mine
            </div>
            <div className="arcade__control-item">
              <span className="arcade__pixel-icon">⚓</span> = Anchor
            </div>
            <div className="arcade__control-item">
              <span className="arcade__pixel-icon">🟢</span> = Toxic Net
            </div>
            <div className="arcade__control-item">
              <span className="arcade__pixel-icon">🕸️</span> = Ghost Net
            </div>
            <div className="arcade__control-item">
              <span className="arcade__pixel-icon">🛍️</span> = Plastic Bag
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
