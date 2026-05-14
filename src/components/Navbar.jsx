import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'legacy', label: 'Legacy' },
  { id: 'pledge', label: 'Pledge' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'game', label: 'Arcade' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'register', label: 'Register' },
  { id: 'social', label: 'Social' },
  { id: 'partners', label: 'Partners' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)

      // Determine active section
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean)
      const scrollPos = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setMobileOpen(false)
    }
  }

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar__inner">
          <div className="navbar__brand" onClick={() => scrollTo('hero')}>
            <span className="navbar__brand-icon">🌊</span>
            <span className="navbar__brand-text">OCEANS 2026</span>
          </div>

          <div className="navbar__links">
            {navLinks.map(link => (
              <button
                key={link.id}
                className={`navbar__link ${activeSection === link.id ? 'navbar__link--active' : ''}`}
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    className="navbar__link-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            className="navbar__cta"
            onClick={() => scrollTo('register')}
          >
            Register Now
          </button>

          <button
            className={`navbar__burger ${mobileOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu__inner">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  className={`mobile-menu__link ${activeSection === link.id ? 'mobile-menu__link--active' : ''}`}
                  onClick={() => scrollTo(link.id)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                className="mobile-menu__cta btn btn-primary"
                onClick={() => scrollTo('register')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Register Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
