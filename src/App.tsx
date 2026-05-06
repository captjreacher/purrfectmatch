import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import { defaultProfile, demoProfile, mergeProfile, PetProfile } from './appState'
import './App.css'

const STORAGE_KEY = 'petfilth-lite-session'

type SavedSession = {
  profile: PetProfile
  hasSeenLanding: boolean
  onboarded: boolean
  auth?: {
    email: string
    mode: 'signup' | 'login'
  }
}

function createInitialSession(): SavedSession {
  return {
    profile: mergeProfile(defaultProfile),
    hasSeenLanding: false,
    onboarded: false,
  }
}

function loadSession(): SavedSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialSession()

    const parsed = JSON.parse(raw) as Partial<SavedSession>

    return {
      profile: mergeProfile(parsed.profile ?? defaultProfile),
      hasSeenLanding: Boolean(parsed.hasSeenLanding),
      onboarded: Boolean(parsed.onboarded),
      auth: parsed.auth,
    }
  } catch {
    return createInitialSession()
  }
}

export default function App() {
  const [session, setSession] = useState<SavedSession>(() => loadSession())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  const handleCreateProfile = () => {
    setSession(prev => ({
      ...prev,
      hasSeenLanding: true,
      onboarded: true,
    }))
  }

  const handleDemoPet = () => {
    setSession(prev => ({
      ...prev,
      hasSeenLanding: true,
      onboarded: true,
      profile: { ...demoProfile },
    }))
  }

  const handleAuthComplete = (email: string, mode: 'signup' | 'login') => {
    setSession(prev => ({
      ...prev,
      hasSeenLanding: true,
      onboarded: true,
      auth: { email, mode },
    }))
  }

  if (!session.hasSeenLanding) {
    return (
      <LandingPage
        onCreateProfile={handleCreateProfile}
        onDemoPet={handleDemoPet}
        onAuthComplete={handleAuthComplete}
      />
    )
  }

  return (
    <div className="app onboarding-app">
      <div className="onboarding-card">
        <div className="eyebrow">PETFILTH · LIVE</div>
        <h1>Welcome to PetFilth.</h1>
        <p className="intro">
          Marketing landing, local sign up and GitHub Pages deployment are now active.
        </p>

        <div className="feature-grid feature-grid-marketing">
          <div className="feature-card">
            <div className="feature-icon">🐾</div>
            <div className="feature-text">
              <strong>Profile system</strong>
              <span>Pet-first onboarding with chaotic compatibility logic.</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-text">
              <strong>Messaging layer</strong>
              <span>Woof/meow translation flow ready for next pass.</span>
            </div>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={() => setSession(createInitialSession())}
        >
          Reset prototype
        </button>
      </div>
    </div>
  )
}
