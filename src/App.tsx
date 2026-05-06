import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import SwipeCard from './components/SwipeCard'
import MatchModal from './components/MatchModal'
import { pets, Pet } from './data/pets'
import { defaultProfile, demoProfile, getMatchScore, isDeterministicMatch, mergeProfile, PetProfile } from './appState'
import './App.css'

const STORAGE_KEY = 'petfilth-lite-session'

type SavedSession = {
  profile: PetProfile
  hasSeenLanding: boolean
  onboarded: boolean
  currentIndex: number
  matches: Pet[]
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
    currentIndex: 0,
    matches: [],
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
      currentIndex: Number.isFinite(parsed.currentIndex) ? Number(parsed.currentIndex) : 0,
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
      auth: parsed.auth,
    }
  } catch {
    return createInitialSession()
  }
}

export default function App() {
  const [session, setSession] = useState<SavedSession>(() => loadSession())
  const [activeView, setActiveView] = useState<'swipe' | 'matches'>('swipe')
  const [showMatch, setShowMatch] = useState<Pet | null>(null)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const currentPet = pets[session.currentIndex]
  const isFinished = session.currentIndex >= pets.length

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  const handleCreateProfile = () => setSession(prev => ({ ...prev, hasSeenLanding: true, onboarded: true }))

  const handleDemoPet = () => setSession(prev => ({ ...prev, hasSeenLanding: true, onboarded: true, profile: { ...demoProfile } }))

  const handleAuthComplete = (email: string, mode: 'signup' | 'login') => {
    setSession(prev => ({ ...prev, hasSeenLanding: true, onboarded: true, auth: { email, mode } }))
  }

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentPet) return
    const matched = dir === 'right' && isDeterministicMatch(currentPet, session.profile)
    setDirection(dir)
    if (matched) setTimeout(() => setShowMatch(currentPet), 250)
    setTimeout(() => {
      setSession(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        matches: matched && !prev.matches.some(pet => pet.id === currentPet.id) ? [...prev.matches, currentPet] : prev.matches,
      }))
      setDirection(null)
    }, 300)
  }

  const resetPrototype = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(createInitialSession())
    setActiveView('swipe')
  }

  const restartSwipes = () => {
    setSession(prev => ({ ...prev, currentIndex: 0, matches: [] }))
    setActiveView('swipe')
  }

  if (!session.hasSeenLanding) {
    return <LandingPage onCreateProfile={handleCreateProfile} onDemoPet={handleDemoPet} onAuthComplete={handleAuthComplete} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="topbar">
          <div className="logo"><span className="logo-icon">🐾</span><h1>PetFilth</h1></div>
          <button className="ghost-btn" onClick={resetPrototype}>Reset</button>
        </div>
        <p className="tagline">Personality-led pet matching for {session.profile.petName || 'your pet'}.</p>
        <div className="stats-row">
          <button className={activeView === 'swipe' ? 'pill active' : 'pill'} onClick={() => setActiveView('swipe')}>Swipe</button>
          <button className={activeView === 'matches' ? 'pill active' : 'pill'} onClick={() => setActiveView('matches')}>❤️ {session.matches.length} matches</button>
        </div>
      </header>

      <main className="swipe-container">
        {activeView === 'matches' ? (
          <section className="matches-panel">
            <h2>Your matches</h2>
            {session.matches.length === 0 ? <p>No matches yet. Like pets with a strong compatibility score.</p> : session.matches.map(pet => {
              const score = getMatchScore(pet, session.profile)
              return (
                <article key={pet.id} className="match-row">
                  <img src={pet.image} alt={pet.name} />
                  <div className="match-row-meta"><strong>{pet.name}</strong><span>{pet.breed} · {score}% fit</span></div>
                  <button className="message-btn" onClick={() => alert('woof woof — paid translation coming soon')}>Message</button>
                </article>
              )
            })}
          </section>
        ) : isFinished ? (
          <div className="finished-card">
            <div className="finished-icon">🎉</div>
            <h2>Queue complete</h2>
            <p>{session.profile.petName} matched with {session.matches.length} pet{session.matches.length !== 1 ? 's' : ''}.</p>
            <button className="reset-btn" onClick={restartSwipes}>Run again</button>
          </div>
        ) : (
          <>
            {pets[session.currentIndex + 1] && <SwipeCard pet={pets[session.currentIndex + 1]} isBackground />}
            <SwipeCard pet={currentPet} onSwipe={handleSwipe} swipeDirection={direction} matchScore={getMatchScore(currentPet, session.profile)} />
          </>
        )}
      </main>

      {!isFinished && activeView === 'swipe' && (
        <footer className="action-buttons">
          <button className="action-btn nope" onClick={() => handleSwipe('left')} aria-label="Pass"><span>✕</span></button>
          <button className="action-btn like" onClick={() => handleSwipe('right')} aria-label="Like"><span>❤️</span></button>
        </footer>
      )}
      {showMatch && <MatchModal pet={showMatch} onClose={() => setShowMatch(null)} />}
    </div>
  )
}
