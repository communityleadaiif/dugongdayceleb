import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './Legacy.css'

const achievements = [
  {
    icon: '🔬',
    title: 'Principal Scientist, CMFRI/ICAR',
    desc: 'Served at the Central Marine Fisheries Research Institute, leading groundbreaking research in Indian ichthyology.'
  },
  {
    icon: '🐟',
    title: 'Lalmohania velutina',
    desc: 'A new fish species named in his honor, recognizing his extensive contributions to marine biology.'
  },
  {
    icon: '🐬',
    title: 'Pioneer of Dolphin Research',
    desc: 'Pioneered research on river dolphins in the Ganges, Brahmaputra, and marine dolphins across Indian waters.'
  },
  {
    icon: '🌱',
    title: '"Catch Them Young" Program',
    desc: 'Initiated this visionary program to instill environmental consciousness in the youth of Kanniyakumari.'
  },
  {
    icon: '🛡️',
    title: 'Conservation Activist',
    desc: 'Led campaigns against threats to ecosystems, including nuclear projects in Koodankulam and harbor developments.'
  },
  {
    icon: '📚',
    title: 'Author & Educator',
    desc: 'Authored numerous research papers and books on marine biology, inspiring generations of scientists.'
  }
]

function AnimatedCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Legacy() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="legacy" className="section legacy" ref={sectionRef}>
      <div className="container">
        {/* Section header */}
        <motion.div
          className="legacy__header text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">The Legacy</span>
          <h2 className="legacy__title">
            Dr. R. S. Lal Mohan
          </h2>
          <p className="legacy__role text-gold">(1937 – 2024)</p>
          <p className="legacy__role-subtitle">Father of Eco-Awareness</p>
          <div className="section-divider" />
        </motion.div>

        {/* Portrait & Bio layout */}
        <div className="legacy__grid">
          {/* Portrait side */}
          <motion.div
            className="legacy__portrait-container"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="legacy__portrait-frame">
              <div className="legacy__portrait-glow" />
              <img
                src="/lal-mohan.jpg"
                alt="Dr. R. S. Lal Mohan - Father of Eco-Awareness"
                className="legacy__portrait-img"
              />
            </div>
            {/* Quote */}
            <div className="legacy__quote glass-card">
              <svg className="legacy__quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9.135 5.015c-3.6.72-6.135 3.54-6.135 7.485 0 3.3 2.28 5.4 4.8 5.4 2.52 0 4.2-1.86 4.2-4.2 0-2.16-1.56-3.84-3.48-4.08.36-2.04 2.04-3.42 4.08-3.78L9.135 5.015zm10.8 0c-3.6.72-6.135 3.54-6.135 7.485 0 3.3 2.28 5.4 4.8 5.4 2.52 0 4.2-1.86 4.2-4.2 0-2.16-1.56-3.84-3.48-4.08.36-2.04 2.04-3.42 4.08-3.78l-3.465-.825z" fill="var(--bioluminescent)" opacity="0.4"/>
              </svg>
              <p>"Protecting the environment is not a choice, it is a responsibility we owe to future generations."</p>
              <span className="legacy__quote-author">— Dr. R. S. Lal Mohan</span>
            </div>
          </motion.div>

          {/* Bio side */}
          <motion.div
            className="legacy__bio"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="legacy__bio-text">
              Dr. R. S. Lal Mohan was a distinguished Indian marine biologist and ichthyologist 
              who served as a <strong>Principal Scientist</strong> at the Central Marine Fisheries Research 
              Institute (CMFRI) and the Indian Council of Agricultural Research (ICAR).
            </p>
            <p className="legacy__bio-text">
              Known as the <em>"Father of Eco-Awareness"</em> in the Kanniyakumari District, his 
              lifelong dedication to environmental protection and community-based conservation 
              transformed marine science education in India. His pioneering research on dolphins 
              and fish taxonomy led to a new species — <strong><em>Lalmohania velutina</em></strong> — 
              being named in his honor.
            </p>
            <p className="legacy__bio-text">
              Dr. Lal Mohan played pivotal roles in INTACH and the Conservation of Nature Trust (CNT), 
              and his <em>"Catch Them Young"</em> program continues to inspire young environmentalists 
              across Tamil Nadu and beyond.
            </p>
          </motion.div>
        </div>

        {/* Achievements grid */}
        <div className="legacy__achievements">
          <h3 className="text-center" style={{ marginBottom: '2rem' }}>Key Contributions</h3>
          <div className="legacy__achievements-grid">
            {achievements.map((a, i) => (
              <AnimatedCard key={i} delay={0.1 * i}>
                <div className="legacy__achievement glass-card">
                  <span className="legacy__achievement-icon">{a.icon}</span>
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
