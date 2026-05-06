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
  auth?: { email: string; mode: 'signup' | 'login' }
}

function createInitialSession(): SavedSession {
  return { profile: mergeProfile(defaultProfile), hasSeenLanding: false, onboarded: false, currentIndex: 0, matches: [] }
}

function safeIndex(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(Math.floor(n), pets.length)
}

function isPet(value: unknown): value is Pet {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Pet>
  return typeof item.id === 'number' && typeof item.name === 'string' && typeof item.image === 'string'
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
      currentIndex: safeIndex(parsed.currentIndex),
      matches: Array.isArray(parsed.matches) ? parsed.matches.filter(isPet) : [],
      auth: parsed.auth,
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return createInitialSession()
  }
}

export default function App() {
  const [session, setSession] = useState<SavedSession>(() => loadSession())
  const [activeView, setActiveView] = useState<'swipe' | 'matches'>('swipe')
  const [showMatch, setShowMatch] = useState<Pet | null>(null)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const index = safeIndex(session.currentIndex)
  const currentPet = pets[index]
  const isFinished = index >= pets.length || !currentPet

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, currentIndex: index })) }, [session, index])

  const handleCreateProfile = () => setSession(prev => ({ ...prev, hasSeenLanding: true, onboarded: true, currentIndex: 0 }))
  const handleDemoPet = () => setSession(prev => ({ ...prev, hasSeenLanding: true, onboarded: true, currentIndex: 0, matches: [], profile: { ...demoProfile } }))
  const handleAuthComplete = (email: string, mode: 'signup' | 'login') => setSession(prev => ({ ...prev, hasSeenLanding: true, onboarded: true, currentIndex: 0, auth: { email, mode } }))

  const resetPrototype = () => { localStorage.removeItem(STORAGE_KEY); setSession(createInitialSession()); setActiveView('swipe') }
  const restartSwipes = () => { setSession(prev => ({ ...prev, currentIndex: 0, matches: [] })); setActiveView('swipe') }

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentPet) return
    const matched = dir === 'right' && isDeterministicMatch(currentPet, session.profile)
    setDirection(dir)
    if (matched) window.setTimeout(() => setShowMatch(currentPet), 250)
    window.setTimeout(() => {
      setSession(prev => ({
        ...prev,
        currentIndex: safeIndex(prev.currentIndex) + 1,
        matches: matched && !prev.matches.some(pet => pet.id === currentPet.id) ? [...prev.matches, currentPet] : prev.matches,
      }))
      setDirection(null)
    }, 300)
  }

  if (!session.hasSeenLanding) {
    return <LandingPage onCreateProfile={handleCreateProfile} onDemoPet={handleDemoPet} onAuthComplete={handleAuthComplete} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="topbar"><div className="logo"><span className="logo-icon">🐾</span><h1>PetFilth</h1></div><button className="ghost-btn" onClick={resetPrototype}>Reset</button></div>
        <p className="tagline">Personality-led pet matching for {session.profile.petName || 'your pet'}.</p>
        <div className="stats-row"><button className={activeView === 'swipe' ? 'pill active' : 'pill'} onClick={() => setActiveView('swipe')}>Swipe</button><button className={activeView === 'matches' ? 'pill active' : 'pill'} onClick={() => setActiveView('matches')}>❤️ {session.matches.length} matches</button></div>
      </header>
      <main className="swipe-container">
        {activeView === 'matches' ? (
          <section className="matches-panel"><h2>Your matches</h2>{session.matches.length === 0 ? <p>No matches yet. Like pets with a strong compatibility score.</p> : session.matches.map(pet => <article key={pet.id} className="match-row"><img src={pet.image} alt={pet.name} /><div className="match-row-meta"><strong>{pet.name}</strong><span>{pet.breed} · {getMatchScore(pet, session.profile)}% fit</span></div><button className="message-btn" onClick={() => window.alert('woof woof — paid translation coming soon')}>Message</button></article>)}</section>
        ) : isFinished ? (
          <div className="finished-card"><div className="finished-icon">🎉</div><h2>Queue complete</h2><p>{session.profile.petName} matched with {session.matches.length} pet{session.matches.length !== 1 ? 's' : ''}.</p><button className="reset-btn" onClick={restartSwipes}>Run again</button></div>
        ) : (
          <><SwipeCard pet={currentPet} onSwipe={handleSwipe} swipeDirection={direction} matchScore={getMatchScore(currentPet, session.profile)} /></>
        )}
      </main>
      {!isFinished && activeView === 'swipe' && <footer className="action-buttons"><button className="action-btn nope" onClick={() => handleSwipe('left')} aria-label="Pass"><span>✕</span></button><button className="action-btn like" onClick={() => handleSwipe('right')} aria-label="Like"><span>❤️</span></button></footer>}
      {showMatch && <MatchModal pet={showMatch} onClose={() => setShowMatch(null)} />}
    </div>
  )
}
