import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Partners.css'

export default function Partners() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="partners" className="section section-compact partners" ref={ref}>
      <div className="container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">🤝 Partners & Outreach</span>
          <h2 style={{ marginTop: '16px' }}>Our Ecosystem</h2>
          <div className="section-divider" />
        </motion.div>

        {/* Partners banner */}
        <motion.div
          className="partners__banner-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="/partners-banner.png"
            alt="Event Partners - Tech, Innovation, Radio, and Print Media Partners"
            className="partners__banner-img"
          />
        </motion.div>
      </div>
    </section>
  )
}
