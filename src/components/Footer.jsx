import './Footer.css'
import { hashtags } from '../data/eventData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="rgba(0,29,61,0.4)" />
        </svg>
      </div>

      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3 className="footer__title">
              🌊 Oceans of Knowledge 2026
            </h3>
            <p className="footer__tagline">
              <em>"Protecting the Gardeners of the Sea"</em>
            </p>
            <p className="footer__tribute">
              Dedicated to the memory of Dr. R. S. Lal Mohan<br />
              <span>Father of Eco-Awareness (1937–2024)</span>
            </p>
          </div>

          <div className="footer__links">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#legacy">Dr. Lal Mohan's Legacy</a></li>
              <li><a href="#competitions">Competitions</a></li>
              <li><a href="#quiz">Quick Quiz</a></li>
              <li><a href="#register">Register</a></li>
            </ul>
          </div>

          <div className="footer__contact">
            <h5>Contact</h5>
            <ul>
              <li>AJK Innovation Incubator Foundation (AIIF)</li>
              <li>📧 info@aiif.in</li>
              <li>📞 +91-8925889316</li>
              <li>AJK College of Arts and Science, Navakkarai, Coimbatore</li>
            </ul>
          </div>
        </div>

        {/* Hashtags bar */}
        <div className="footer__hashtags">
          {hashtags.map(tag => (
            <span key={tag} className="footer__hashtag">{tag}</span>
          ))}
        </div>

        <div className="footer__bottom">
          <p>© 2026 AJK Group of Institutions & AIIF. All rights reserved.</p>
          <p className="footer__sdg">
            Supporting <strong>SDG 14: Life Below Water</strong> 🐋
          </p>
        </div>
      </div>
    </footer>
  )
}
