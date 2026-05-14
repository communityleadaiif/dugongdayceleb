import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Clarity from '@microsoft/clarity'

// ─── Microsoft Clarity — Full API Configuration ───────────────────────────────
const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID

if (clarityId && clarityId !== 'YOUR_CLARITY_PROJECT_ID') {

  // 1. Initialize Clarity with the project ID
  Clarity.init(clarityId)

  // 2. Cookie Consent — grant full tracking consent immediately.
  //    This is the most common reason data does NOT appear in the dashboard.
  //    If your Clarity project requires explicit consent, this call activates it.
  Clarity.consentV2({
    ad_Storage: 'granted',
    analytics_Storage: 'granted'
  })

  // 3. Identify API — called on page load for optimal session tracking.
  //    customId is required; the rest are optional descriptors that
  //    make sessions easier to find in the Clarity recordings list.
  Clarity.identify(
    'ok2026-visitor',          // customId  (required)
    undefined,                 // customSessionId (auto-generated)
    undefined,                 // customPageId    (auto-generated)
    'Dugong Day Portal Visitor' // friendlyName
  )

  // 4. Custom Tags — tag every session with site context so you can
  //    filter recordings in the Clarity dashboard by project/event.
  Clarity.setTag('project', 'Oceans of Knowledge 2026')
  Clarity.setTag('event', 'World Dugong Day May 28 2026')
  Clarity.setTag('host', 'AJK Group + AIIF + CMFRI')
  Clarity.setTag('env', import.meta.env.MODE ?? 'production')

  // 5. Custom Event — fire a page-load event so the Clarity Smart Events
  //    panel immediately shows portal engagement data.
  Clarity.event('portal_loaded')

  // 6. Upgrade — mark every session for full recording priority
  //    so no sessions are sampled out of the recording queue.
  Clarity.upgrade('dugong_day_portal_full_capture')
}

// ─────────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
