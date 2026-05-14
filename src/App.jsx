import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import FishCursor from './components/FishCursor'
import BubbleOverlay from './components/BubbleOverlay'
import SwimmingFish from './components/SwimmingFish'
import Hero from './components/Hero'
import Legacy from './components/Legacy'
import Pledge from './components/Pledge'
import Timeline from './components/Timeline'
import Competitions from './components/Competitions'
import DugongGame from './components/DugongGame'
import Quiz from './components/Quiz'
import Registration from './components/Registration'
import SocialMedia from './components/SocialMedia'
import Partners from './components/Partners'
import Footer from './components/Footer'
import AudioPlayer from './components/AudioPlayer'

// Lazy load the heavy 3D scene
const UnderwaterScene = lazy(() => import('./components/UnderwaterScene'))

function App() {
  return (
    <>
      {/* 3D Underwater Background */}
      <Suspense fallback={null}>
        <UnderwaterScene />
      </Suspense>

      {/* Ambient overlays */}
      <BubbleOverlay />
      <SwimmingFish />

      {/* Custom fish cursor */}
      <FishCursor />

      {/* Global Audio Player */}
      <AudioPlayer />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <Hero />
        <Legacy />
        <Pledge />
        <Timeline />
        <Competitions />
        <DugongGame />
        <Quiz />
        <Registration />
        <SocialMedia />
        <Partners />
        <Footer />
      </main>
    </>
  )
}

export default App
