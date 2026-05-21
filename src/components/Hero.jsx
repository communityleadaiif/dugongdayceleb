import { motion } from 'framer-motion'
import './Hero.css'

// Logos from public directory
const ajkLogo = '/ajk-college-logo.png'
const cmfriLogo = '/cmfri-new-logo.jpg'

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      {/* Animated wave overlay at bottom */}
      <div className="hero__waves">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z" fill="rgba(0,8,20,0.6)" />
          <path d="M0,80 C300,40 600,100 900,60 C1100,30 1300,80 1440,60 L1440,120 L0,120 Z" fill="rgba(0,8,20,0.4)" />
        </svg>
      </div>

      <div className="hero__content">
        {/* Logo bar */}
        <motion.div
          className="hero__logos"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="hero__logo-wrapper">
            <img src={ajkLogo} alt="AJK Group of Institutions" className="hero__logo hero__logo--ajk" />
            <span className="hero__logo-label">AJK Group of Institutions</span>
          </div>
          <div className="hero__collab-tag">In Collaboration with</div>
          <div className="hero__logo-wrapper">
            <img src={cmfriLogo} alt="CMFRI" className="hero__logo hero__logo--cmfri" />
            <span className="hero__logo-label">CMFRI</span>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          className="badge hero__badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          🌊 World Dugong Day • May 28, 2026
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <span className="hero__title-line">Oceans of</span>
          <span className="hero__title-line text-gradient">Knowledge 2026</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
        >
          National Online Marine Conservation Initiative
        </motion.p>

        {/* Tribute line */}
        <motion.div
          className="hero__tribute"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          Honoring the Legacy of <span className="text-gold">Dr. R. S. Lal Mohan</span>
          <div className="hero__tribute-title">Father of Eco-Awareness</div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <button className="btn btn-primary" onClick={() => scrollTo('register')}>
            <span>🐋</span> Register Now
          </button>
          <button className="btn btn-outline" onClick={() => scrollTo('competitions')}>
            Explore Competitions
          </button>
        </motion.div>

        {/* Highly visible plain text link for search engine crawlers */}
        <motion.div
          className="hero__crawler-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          style={{ marginTop: '16px' }}
        >
          <a
            href="https://tinyurl.com/dugongday"
            target="_blank"
            rel="noopener noreferrer"
            className="crawler-anchor"
          >
            Register for Dugong Day Here
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="hero__stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.0 }}
        >
          <div className="hero__stat">
            <span className="hero__stat-num">3</span>
            <span className="hero__stat-label">National Competitions</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">25</span>
            <span className="hero__stat-label">Quiz Questions</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">🏆</span>
            <span className="hero__stat-label">Cash Prizes</span>
          </div>
        </motion.div>

        {/* Scroll indicator - now part of content flow to prevent overlap */}
        <motion.div
          className="hero__scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          onClick={() => scrollTo('legacy')}
        >
          <span>Dive Deeper</span>
          <div className="hero__scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
