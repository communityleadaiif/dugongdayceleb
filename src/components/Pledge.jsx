import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Pledge.css'

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
const BACKEND_SECRET_TOKEN = import.meta.env.VITE_BACKEND_SECRET_TOKEN || '';

// Animated number counter
function AnimatedCounter({ value, duration = 2 }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = parseInt(value) || 0
    if (end === 0) {
      setDisplayed(0)
      return
    }
    const stepTime = (duration * 1000) / end
    const timer = setInterval(() => {
      start += Math.ceil(end / 100) // Speed up for large numbers
      if (start >= end) {
        setDisplayed(end)
        clearInterval(timer)
      } else {
        setDisplayed(start)
      }
    }, Math.max(stepTime, 20))
    return () => clearInterval(timer)
  }, [value, isInView, duration])

  return <span ref={ref}>{displayed.toLocaleString()}</span>
}

export default function Pledge() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [name, setName] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [signed, setSigned] = useState(false)
  const [stats, setStats] = useState({ visitors: 1200, pledges: 450 })

  // 1. Fetch real stats from Backend
  useEffect(() => {
    const fetchStats = async () => {
      if (!GOOGLE_SCRIPT_URL) return;
      try {
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getStats`);
        const data = await res.json();
        if (data.visitors) setStats(data);
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Log Visitor on Load
  useEffect(() => {
    const logVisitor = async () => {
      if (!GOOGLE_SCRIPT_URL) return;
      const visited = sessionStorage.getItem('ok2026_visited');
      if (!visited) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: new URLSearchParams({ action: 'visitor' })
          });
          sessionStorage.setItem('ok2026_visited', 'true');
        } catch (err) {
          console.error('Visitor log error:', err);
        }
      }
    };
    logVisitor();
  }, []);

  const handleSign = async () => {
    if (!name.trim() || !accepted) return;
    
    setSigned(true);
    
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams({ 
            action: 'pledge',
            name: name,
            token: BACKEND_SECRET_TOKEN
          })
        });
      } catch (err) {
        console.error('Pledge save error:', err);
      }
    }
  };

  return (
    <section id="pledge" className="section pledge-section" ref={sectionRef}>
      {/* Counters bar */}
      <div className="pledge__counters">
        <motion.div
          className="pledge__counter-item"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="pledge__counter-icon">👁️</div>
          <div className="pledge__counter-num">
            <AnimatedCounter value={stats.visitors} />
          </div>
          <div className="pledge__counter-label">Portal Visitors</div>
        </motion.div>

        <div className="pledge__counter-divider" />

        <motion.div
          className="pledge__counter-item"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <div className="pledge__counter-icon">🤝</div>
          <div className="pledge__counter-num pledge__counter-num--highlight">
            <AnimatedCounter value={stats.pledges} />
          </div>
          <div className="pledge__counter-label">Pledge Takers</div>
        </motion.div>

        <div className="pledge__counter-divider" />

        <motion.div
          className="pledge__counter-item"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="pledge__counter-icon">🌍</div>
          <div className="pledge__counter-num">
            <AnimatedCounter value={28} duration={1.5} />
          </div>
          <div className="pledge__counter-label">States Participating</div>
        </motion.div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge badge--gold">🌊 Take the Oath</span>
          <h2 className="pledge__title">Marine Conservation Pledge</h2>
          <p className="pledge__subtitle">
            Join thousands of ocean guardians. Sign the pledge inspired by Dr. Lal Mohan's legacy.
          </p>
          <div className="section-divider" />
        </motion.div>

        <motion.div
          className="pledge__card glass-card"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!signed ? (
            <>
              <div className="pledge__text">
                <div className="pledge__scroll-icon">📜</div>
                <blockquote>
                  <p>
                    "I solemnly pledge to protect and preserve our oceans, marine life, and coastal ecosystems.
                    I commit to reducing plastic pollution, supporting marine conservation efforts,
                    and spreading awareness about the importance of preserving biodiversity below water."
                  </p>
                  <p>
                    "Inspired by the legacy of <strong>Dr. R. S. Lal Mohan</strong>, I promise to be a guardian of the sea
                    and work towards a sustainable blue planet for future generations."
                  </p>
                </blockquote>
              </div>

              <div className="pledge__form">
                <input
                  type="text"
                  className="form-input pledge__input"
                  placeholder="Enter your full name to sign"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="pledge__checkbox">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <span>I take this pledge for marine conservation</span>
                </label>
                <motion.button
                  className="btn btn-gold pledge__sign-btn"
                  disabled={!accepted || !name.trim()}
                  onClick={handleSign}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✍️ Sign the Pledge
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              className="pledge__success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="pledge__success-icon">🎉</div>
              <h3>Thank You, {name}!</h3>
              <p>You are now an Ocean Guardian.</p>
              <p className="pledge__success-note">
                Your pledge joins others in protecting marine life.
              </p>
              <div className="pledge__success-badge glass-card">
                <span>🏅</span>
                <div>
                  <strong>Marine Conservation Guardian</strong>
                  <span>Oceans of Knowledge 2026</span>
                </div>
              </div>
              <p className="pledge__success-sdg">
                Supporting <strong>SDG 14: Life Below Water</strong> 🐋
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
