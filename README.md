# 🌊 Oceans of Knowledge 2026
### World Dugong Day National Online Marine Conservation Initiative

Inspired by the marine conservation legacy of **Dr. R. S. Lal Mohan** (Father of Eco-Awareness).

---

## 🚀 Live Demo
**Website URL**: [https://dugong-day-celebration.vercel.app](https://dugong-day-celebration.vercel.app)

---

## ✨ Features
- **3D Underwater Environment**: Immersive Three.js scene featuring schools of fish, a gliding dugong, and shimmering surface light rays.
- **Dugong Deep Sea Run**: A custom retro HTML5 Canvas arcade game with 5 unique marine hazard types and persistent high scores.
- **Real-time Backend**: Integrated with Google Sheets and Google Drive for automated registration, file submissions, and visitor statistics.
- **Cinematic Experience**: Premium typography (`Syne`, `Cormorant Garamond`) and ambient background music with a floating glassmorphism controller.
- **Conservation Pledge**: Interactive oath section with live counter tracking "Ocean Guardians" across India.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **3D Graphics**: Three.js / @react-three/fiber
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS (Cinematic Design Tokens)
- **Backend**: Google Apps Script
- **Database/Storage**: Google Sheets & Google Drive
- **Hosting**: Vercel

---

## ⚙️ Project Setup

### 1. Local Development
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### 2. Backend Setup (Google Sheets)
The backend logic is located in `google-apps-script/Code.gs`.
1. Create a Google Sheet with tabs: `Article_Submissions`, `Drawing_Submissions`, `Pledges`, and `Stats`.
2. Open Apps Script via **Extensions > Apps Script**.
3. Paste the `Code.gs` content and deploy as a **Web App** (Access: Anyone).
4. Update the `GOOGLE_SCRIPT_URL` in `src/components/Registration.jsx` and `src/components/Pledge.jsx`.

---

## 📁 Project Structure
- `src/components/`: Modular React components (Hero, Legacy, Arcade, Quiz, etc.)
- `public/`: Static assets (Logos, Portrait of Dr. Lal Mohan, Background Music)
- `google-apps-script/`: Backend logic for data collection

---

## 👤 Organized By
- **AJK Group of Institutions**
- **AJK Innovation Incubator Foundation (AIIF)**

## 🐋 Media & Outreach Partners
- Magilchi FM
- FM Radio Partners
- Social Media Outreach Partners
