import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Clarity from '@microsoft/clarity'

// Initialize Microsoft Clarity tracking engine mapped dynamically to isolated env metrics
const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID
if (clarityId && clarityId !== 'YOUR_CLARITY_PROJECT_ID') {
  Clarity.init(clarityId)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
