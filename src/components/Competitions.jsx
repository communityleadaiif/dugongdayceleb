import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { competitionData } from '../data/eventData'
import './Competitions.css'

export default function Competitions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [expandedId, setExpandedId] = useState(null)

  const scrollToRegister = (compId) => {
    const el = document.getElementById('register')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="competitions" className="section competitions" ref={ref}>
      <div className="container-wide">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">Compete & Win</span>
          <h2 style={{ marginTop: '16px' }}>National Competitions</h2>
          <p style={{ marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
            Three exciting competitions to showcase your knowledge, writing skills, and artistic talent
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="competitions__grid">
          {competitionData.map((comp, i) => (
            <motion.div
              key={comp.id}
              className={`competitions__card glass-card ${expandedId === comp.id ? 'competitions__card--expanded' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 * i }}
              style={{ '--card-color': comp.color }}
            >
              <div className="competitions__card-header">
                <span className="competitions__card-icon">{comp.icon}</span>
                <span className="competitions__card-category">{comp.category}</span>
              </div>

              <h3 className="competitions__card-title">{comp.title}</h3>
              <p className="competitions__card-desc">{comp.description}</p>

              {/* Quick details */}
              <div className="competitions__details">
                <div className="competitions__detail">
                  <span className="competitions__detail-label">Mode</span>
                  <span className="competitions__detail-value">{comp.mode}</span>
                </div>
                <div className="competitions__detail">
                  <span className="competitions__detail-label">Participation</span>
                  <span className="competitions__detail-value">{comp.participation}</span>
                </div>
                {comp.duration && (
                  <div className="competitions__detail">
                    <span className="competitions__detail-label">Duration</span>
                    <span className="competitions__detail-value">{comp.duration}</span>
                  </div>
                )}
                {comp.wordLimit && (
                  <div className="competitions__detail">
                    <span className="competitions__detail-label">Word Limit</span>
                    <span className="competitions__detail-value">{comp.wordLimit}</span>
                  </div>
                )}
                {comp.format && (
                  <div className="competitions__detail">
                    <span className="competitions__detail-label">Format</span>
                    <span className="competitions__detail-value">{comp.format}</span>
                  </div>
                )}
                {comp.drawingType && (
                  <div className="competitions__detail">
                    <span className="competitions__detail-label">Type</span>
                    <span className="competitions__detail-value">{comp.drawingType}</span>
                  </div>
                )}
              </div>

              {/* Prizes */}
              <div className="competitions__prizes">
                <span>🏆</span> {comp.prizes}
              </div>

              {/* Expandable guidelines */}
              <button
                className="competitions__toggle"
                onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
              >
                {expandedId === comp.id ? '▲ Hide Guidelines' : '▼ View Guidelines'}
              </button>

              <AnimatePresence>
                {expandedId === comp.id && (
                  <motion.div
                    className="competitions__guidelines"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {comp.suggestedAreas && (
                      <div className="competitions__suggested">
                        <h5>Suggested Areas</h5>
                        <div className="competitions__tags">
                          {comp.suggestedAreas.map((area, j) => (
                            <span key={j} className="competitions__tag">{area}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {comp.suggestedConcepts && (
                      <div className="competitions__suggested">
                        <h5>Suggested Concepts</h5>
                        <div className="competitions__tags">
                          {comp.suggestedConcepts.map((concept, j) => (
                            <span key={j} className="competitions__tag">{concept}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {comp.guidelines && (
                      <div className="competitions__rules">
                        <h5>Guidelines</h5>
                        <ol>
                          {comp.guidelines.map((g, j) => (
                            <li key={j}>{g}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {comp.id === 'quiz' && (
                      <div className="competitions__rules">
                        <h5>Details</h5>
                        <ul>
                          <li>Question Type: Multiple Choice Questions (MCQ)</li>
                          <li>Duration: 10–15 Minutes</li>
                          <li>E-Certificate for all participants</li>
                          <li>Marine Conservation Pledge at the end</li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <button
                className="btn btn-primary competitions__cta"
                onClick={() => comp.id === 'quiz'
                  ? document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })
                  : scrollToRegister(comp.id)
                }
              >
                {comp.id === 'quiz' ? '🧠 Start Quiz' : '📝 Register & Submit'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
