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
              <li>
                <a href="https://tinyurl.com/dugongday" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Register for Dugong Day Here
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__contact">
            <h5>Contact & Follow</h5>
            <ul>
              <li>AJK Innovation Incubator Foundation (AIIF)</li>
              <li>📧 info@aiif.in</li>
              <li>📞 +91-8925889316</li>
              <li>AJK College of Arts and Science, Navakkarai, Coimbatore</li>
            </ul>
            <div className="footer__socials">
              <a href="https://www.instagram.com/aiif.innovation/" target="_blank" rel="noopener noreferrer" className="footer__social-btn ig" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://in.linkedin.com/company/ajkinnovationincubatorfoundation" target="_blank" rel="noopener noreferrer" className="footer__social-btn li" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://whatsapp.com/channel/0029VbAQruBAO7R8SaWpwi32" target="_blank" rel="noopener noreferrer" className="footer__social-btn wa" title="WhatsApp Channel">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.9.9L22 4.5l-1.5 5.5z"></path></svg>
              </a>
            </div>
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
