import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Registration.css'

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNEhevTxkkgW8fdpAfSgRnRepqiZ33Wpe1ThmezjkpdCXkISl_c2Xsrkbrgu1VK_UUpg/exec'

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry'
]

export default function Registration() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const [activeTab, setActiveTab] = useState('article')
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', city: '', state: '',
    institution: '', competition: 'article', category: '',
    consent: false
  })
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error'

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name'
    if (!formData.phone.match(/^[6-9]\d{9}$/)) return 'Please enter a valid 10-digit Indian mobile number'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address'
    if (!formData.city.trim()) return 'Please enter your city'
    if (!formData.state) return 'Please select your state'
    if (activeTab === 'drawing' && !formData.category) return 'Please select your category (Junior/Middle/Senior)'
    if (!file) return 'Please upload your submission file'
    if (!formData.consent) return 'Please accept the consent'

    // File type validation
    if (activeTab === 'article') {
      const ext = file.name.toLowerCase().split('.').pop()
      if (!['doc', 'docx'].includes(ext)) return 'Article must be in .doc or .docx format'
    }
    if (activeTab === 'drawing') {
      const ext = file.name.toLowerCase().split('.').pop()
      if (!['jpg', 'jpeg', 'pdf', 'png'].includes(ext)) return 'Drawing must be in JPG, PNG, or PDF format'
    }

    // File size validation (10MB max)
    if (file.size > 10 * 1024 * 1024) return 'File size must be less than 10MB'

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validateForm()
    if (error) {
      alert(error)
      return
    }

    setIsSubmitting(true)

    try {
      if (!GOOGLE_SCRIPT_URL) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSubmitStatus('success')
        return
      }

      // Convert file to Base64 for Google Apps Script compatibility
      const reader = new FileReader()
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(file)
      })
      const base64File = await base64Promise

      const params = new URLSearchParams({
        ...formData,
        action: 'submission',
        submissionType: activeTab,
        fileName: file.name,
        fileData: base64File,
        mimeType: file.type
      })

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Essential for GAS
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      // Since we use no-cors, we can't see the response status.
      // We'll assume success if no error was thrown, or the user can check the sheet.
      setSubmitStatus('success')

    } catch (err) {
      console.error('Submission error:', err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '', phone: '', email: '', city: '', state: '',
      institution: '', competition: activeTab, category: '',
      consent: false
    })
    setFile(null)
    setSubmitStatus(null)
  }

  return (
    <section id="register" className="section registration" ref={ref}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">📝 Register & Submit</span>
          <h2 style={{ marginTop: '16px' }}>Competition Registration</h2>
          <p style={{ marginTop: '8px', opacity: 0.6 }}>Submit your entry for Article Writing or Drawing Competition</p>
          <div className="section-divider" />
        </motion.div>

        {/* Tab selector */}
        <div className="reg-tabs">
          <button
            className={`reg-tab ${activeTab === 'article' ? 'reg-tab--active' : ''}`}
            onClick={() => { setActiveTab('article'); resetForm() }}
          >
            📝 Article Writing
          </button>
          <button
            className={`reg-tab ${activeTab === 'drawing' ? 'reg-tab--active' : ''}`}
            onClick={() => { setActiveTab('drawing'); resetForm() }}
          >
            🎨 Drawing
          </button>
        </div>

        <motion.div
          className="reg-form-container glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {submitStatus === 'success' ? (
            <div className="reg-success">
              <span className="reg-success__icon">🎉</span>
              <h3>Submission Successful!</h3>
              <p>Your entry has been received. You will receive a confirmation email shortly.</p>
              <p className="reg-success__note">E-Certificates will be distributed within 7 days after results.</p>
              <button className="btn btn-outline" onClick={resetForm}>Submit Another Entry</button>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="reg-error">
              <span className="reg-error__icon">⚠️</span>
              <h3>Submission Failed</h3>
              <p>There was an error submitting your entry. Please try again.</p>
              <button className="btn btn-primary" onClick={() => setSubmitStatus(null)}>Try Again</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="reg-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                  />
                </div>

                <div className="form-group reg-full-width">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select
                    className="form-select"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group reg-full-width">
                  <label className="form-label">Institution / School / College</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your institution name (optional)"
                    value={formData.institution}
                    onChange={(e) => updateField('institution', e.target.value)}
                  />
                </div>

                {activeTab === 'drawing' && (
                  <div className="form-group reg-full-width">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="junior">Junior</option>
                      <option value="middle">Middle</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                )}

                {/* File upload */}
                <div className="form-group reg-full-width">
                  <label className="form-label">
                    Upload Submission * {activeTab === 'article' ? '(.doc / .docx)' : '(JPG / PDF)'}
                  </label>
                  <div className="reg-file-upload">
                    <input
                      type="file"
                      id="submission-file"
                      accept={activeTab === 'article' ? '.doc,.docx' : '.jpg,.jpeg,.png,.pdf'}
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                    />
                    <label htmlFor="submission-file" className="reg-file-label">
                      {file ? (
                        <>
                          <span>📎</span>
                          <span>{file.name}</span>
                          <span className="reg-file-size">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </>
                      ) : (
                        <>
                          <span>📁</span>
                          <span>Click to upload or drag & drop</span>
                          <span className="reg-file-limit">Max 10MB</span>
                        </>
                      )}
                    </label>
                  </div>
                  {activeTab === 'article' && (
                    <p className="reg-hint">File name format: ParticipantName_ArticleCompetition.docx</p>
                  )}
                  {activeTab === 'drawing' && (
                    <p className="reg-hint">⚠️ The submitted image must be geotagged. Only hand-drawn artworks accepted.</p>
                  )}
                </div>

                {/* Consent */}
                <div className="form-group reg-full-width">
                  <label className="reg-consent">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => updateField('consent', e.target.checked)}
                      required
                    />
                    <span>I agree that my submission may be used for marine awareness campaigns by AJK/AIIF with due credits. I confirm the work is original.</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary reg-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><span className="reg-spinner" /> Submitting...</>
                ) : (
                  <><span>🚀</span> Submit Entry</>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
