import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './AudioPlayer.css'

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Attempt to start on first interaction
    const startAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => console.log("Autoplay blocked"))
      }
      window.removeEventListener('click', startAudio)
    }

    window.addEventListener('click', startAudio)
    return () => window.removeEventListener('click', startAudio)
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="audio-controller">
      <audio ref={audioRef} loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>
      
      <motion.button 
        className={`audio-btn ${isPlaying ? 'audio-btn--playing' : ''}`}
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="audio-waves">
          {[1, 2, 3, 4].map(i => (
            <motion.span 
              key={i}
              animate={isPlaying ? { height: [4, 16, 4] } : { height: 4 }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.6, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <span className="audio-icon">{isPlaying ? '🔊' : '🔇'}</span>
      </motion.button>
    </div>
  )
}
