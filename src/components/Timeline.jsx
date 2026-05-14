import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { timelineEvents } from '../data/eventData'
import './Timeline.css'

export default function Timeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="timeline" className="section section-compact timeline" ref={ref}>
      <div className="container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">Event Agenda</span>
          <h2 style={{ marginTop: '16px' }}>Event Timeline</h2>
          <p style={{ marginTop: '8px', opacity: 0.6 }}>From registration to celebration — your journey with the ocean</p>
          <div className="section-divider" />
        </motion.div>

        <div className="timeline__track">
          <div className="timeline__line" />
          {timelineEvents.map((event, i) => (
            <motion.div
              key={i}
              className={`timeline__item ${event.status === 'highlight' ? 'timeline__item--highlight' : ''} ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            >
              <div className="timeline__node">
                <span>{event.icon}</span>
                {event.status === 'highlight' && <div className="timeline__node-ring" />}
              </div>
              <div className="timeline__card glass-card">
                <div className="timeline__date">
                  <span className="timeline__date-text">{event.date}</span>
                  {event.day && <span className="timeline__day">{event.day}</span>}
                </div>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                {event.status === 'active' && <span className="timeline__status timeline__status--active">● Live Now</span>}
                {event.status === 'upcoming' && <span className="timeline__status timeline__status--upcoming">○ Upcoming</span>}
                {event.status === 'highlight' && <span className="timeline__status timeline__status--highlight">★ World Dugong Day</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
