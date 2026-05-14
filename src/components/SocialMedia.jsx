import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { hashtags } from '../data/eventData'
import './SocialMedia.css'

export default function SocialMedia() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [copied, setCopied] = useState(null)

  const copyHashtag = (tag) => {
    navigator.clipboard.writeText(tag)
    setCopied(tag)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(' '))
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section id="social" className="section section-compact social" ref={ref}>
      <div className="container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">📱 Social Impact</span>
          <h2 style={{ marginTop: '16px' }}>#PostForTheOceanChallenge</h2>
          <p style={{ marginTop: '8px', opacity: 0.6, maxWidth: '600px', margin: '8px auto 0' }}>
            Share your creations on social media and help spread marine conservation awareness
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="social__grid">
          {/* Hashtags */}
          <motion.div
            className="social__hashtags glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4>Official Hashtags</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '16px' }}>Click to copy</p>
            <div className="social__tags">
              {hashtags.map((tag, i) => (
                <motion.button
                  key={tag}
                  className={`social__tag ${copied === tag ? 'social__tag--copied' : ''}`}
                  onClick={() => copyHashtag(tag)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied === tag ? '✓ Copied!' : tag}
                </motion.button>
              ))}
            </div>
            <button className="btn btn-outline social__copy-all" onClick={copyAll}>
              {copied === 'all' ? '✓ All Copied!' : '📋 Copy All Hashtags'}
            </button>
          </motion.div>

          {/* Guidelines */}
          <motion.div
            className="social__guidelines glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4>Social Media Guidelines</h4>
            <ul className="social__rules">
              <li>Post your creations on <strong>Instagram, Facebook,</strong> or <strong>LinkedIn</strong></li>
              <li>Tag <strong>AJK College Official Page</strong> & <strong>AIIF Official Page</strong></li>
              <li>Use official event hashtags listed here</li>
              <li>Entries with maximum creativity and engagement win exciting prizes</li>
              <li>Offensive or copied content will be disqualified</li>
            </ul>

            <h4 style={{ marginTop: '24px' }}>You Can Post</h4>
            <div className="social__post-types">
              <span className="social__post-type">🎨 Drawings & Posters</span>
              <span className="social__post-type">📸 Creative Photos</span>
              <span className="social__post-type">🎬 Awareness Reels</span>
              <span className="social__post-type">📝 Conservation Stories</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
