import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Partners.css'

const partners = [
  { name: 'AJK Group of Institutions', role: 'Organizer', type: 'organizer' },
  { name: 'AJK Innovation Incubator Foundation (AIIF)', role: 'Organizer', type: 'organizer' },
  { name: 'Magilchi FM', role: 'Media Partner', type: 'media' },
  { name: 'FM Radio Partners', role: 'Radio Partner', type: 'pending' },
  { name: 'Newspaper Media Partners', role: 'Print Media Partner', type: 'pending' },
  { name: 'Social Media Outreach Partners', role: 'Digital Partner', type: 'pending' },
]

const outreach = [
  { icon: '🎓', label: 'Colleges Across Tamil Nadu' },
  { icon: '🏛️', label: 'Universities' },
  { icon: '🏫', label: 'Schools' },
  { icon: '⚜️', label: 'NCC & NSS Units' },
  { icon: '💡', label: 'Innovation & Entrepreneurship Cells' },
  { icon: '🚀', label: 'Incubators & Startup Ecosystems' },
  { icon: '🔬', label: 'Marine Research Communities' },
]

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

        {/* Partners grid */}
        <div className="partners__grid">
          {partners.map((p, i) => (
            <motion.div
              key={i}
              className={`partners__card glass-card partners__card--${p.type}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
            >
              <span className="partners__card-role">{p.role}</span>
              <h4 className="partners__card-name">{p.name}</h4>
              {p.type === 'pending' && (
                <span className="partners__card-status">Coming Soon</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Outreach targets */}
        <motion.div
          className="partners__outreach"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-center" style={{ marginBottom: '24px' }}>Outreach Targets</h3>
          <div className="partners__outreach-grid">
            {outreach.map((item, i) => (
              <div key={i} className="partners__outreach-item">
                <span className="partners__outreach-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
