import { useState, useCallback, useEffect } from 'react'
import SwipeCard from './components/SwipeCard'
import MatchModal from './components/MatchModal'
import { pets, Pet } from './data/pets'
import { defaultProfile, getMatchScore, isDeterministicMatch, PetProfile, SwipeRecord } from './appState'
import './App.css'

const STORAGE_KEY = 'petfilth-lite-session'

type SavedSession = {
  profile: PetProfile
  currentIndex: number
  matches: Pet[]
  history: SwipeRecord[]
  onboarded: boolean
}

function createInitialSession(): SavedSession {
  return { profile: defaultProfile, currentIndex: 0, matches: [], history: [], onboarded: false }
}

function loadSession(): SavedSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialSession()

    const parsed = JSON.parse(raw) as Partial<SavedSession>
    return {
      profile: { ...defaultProfile, ...parsed.profile },
      currentIndex: Number.isFinite(parsed.currentIndex) ? Number(parsed.currentIndex) : 0,
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      onboarded: Boolean(parsed.onboarded),
    }
  } catch {
    return createInitialSession()
  }
}

function App() {
  const [session, setSession] = useState<SavedSession>(() => loadSession())
  const [showMatch, setShowMatch] = useState<Pet | null>(null)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [activeView, setActiveView] = useState<'swipe' | 'matches'>('swipe')

  const currentPet = pets[session.currentIndex]
  const isFinished = session.currentIndex >= pets.length
  const progress = Math.min(session.currentIndex + 1, pets.length)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  const setProfile = (profile: PetProfile) => {
    setSession(prev => ({ ...prev, profile }))
  }

  const startApp = () => setSession(prev => ({ ...prev, onboarded: true }))

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    if (!currentPet) return

    const matched = dir === 'right' && isDeterministicMatch(currentPet, session.profile)
    setDirection(dir)

    if (matched) {
      setTimeout(() => setShowMatch(currentPet), 300)
    }

    setTimeout(() => {
      setSession(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        matches: matched && !prev.matches.some(pet => pet.id === currentPet.id)
          ? [...prev.matches, currentPet]
          : prev.matches,
        history: [...prev.history, { petId: currentPet.id, decision: dir === 'right' ? 'like' : 'pass', matched }],
      }))
      setDirection(null)
    }, 300)
  }, [currentPet, session.profile])

  const handleReset = () => {
    setSession(prev => ({ ...prev, currentIndex: 0, matches: [], history: [], onboarded: true }))
    setActiveView('swipe')
  }

  const hardReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(createInitialSession())
    setActiveView('swipe')
  }

  if (!session.onboarded) {
    return (
      <div className="app onboarding-app">
        <section className="onboarding-card">
          <div className="eyebrow">PetFilth Lite</div>
          <h1>Find a compatible playmate for your pet.</h1>
          <p className="intro">A tiny swipe app with personality-led matching. No account, no backend, just a lightweight staged prototype.</p>
          <label>
            Pet name
            <input value={session.profile.petName} onChange={e => setProfile({ ...session.profile, petName: e.target.value })} placeholder="Milo" />
          </label>
          <label>
            Looking for
            <select value={session.profile.species} onChange={e => setProfile({ ...session.profile, species: e.target.value as PetProfile['species'] })}>
              <option value="Any">Any</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </label>
          <label>
            Your pet's vibe
            <textarea value={session.profile.vibe} onChange={e => setProfile({ ...session.profile, vibe: e.target.value })} rows={3} />
          </label>
          <button className="primary-btn" onClick={startApp}>Start swiping</button>
        </section>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="topbar">
          <div className="logo"><span className="logo-icon">🐾</span><h1>PetFilth</h1></div>
          <button className="ghost-btn" onClick={hardReset}>Reset</button>
        </div>
        <p className="tagline">Personality-led pet matching for {session.profile.petName || 'your pet'}.</p>
        <div className="stats-row">
          <button className={activeView === 'swipe' ? 'pill active' : 'pill'} onClick={() => setActiveView('swipe')}>{progress}/{pets.length} viewed</button>
          <button className={activeView === 'matches' ? 'pill active' : 'pill'} onClick={() => setActiveView('matches')}>❤️ {session.matches.length} match{session.matches.length !== 1 ? 'es' : ''}</button>
        </div>
      </header>

      <main className="swipe-container">
        {activeView === 'matches' ? (
          <section className="matches-panel">
            <h2>Your matches</h2>
            {session.matches.length === 0 ? <p>No matches yet. Like pets with a strong compatibility score.</p> : session.matches.map(pet => (
              <article key={pet.id} className="match-row">
                <img src={pet.image} alt={pet.name} />
                <div><strong>{pet.name}</strong><span>{pet.breed} · {getMatchScore(pet, session.profile)}% fit</span></div>
              </article>
            ))}
          </section>
        ) : isFinished ? (
          <div className="finished-card">
            <div className="finished-icon">🎉</div>
            <h2>Queue complete</h2>
            <p>{session.profile.petName} matched with {session.matches.length} pet{session.matches.length !== 1 ? 's' : ''}.</p>
            <button className="reset-btn" onClick={handleReset}>Run again</button>
          </div>
        ) : (
          <>
            {pets[session.currentIndex + 1] && <SwipeCard pet={pets[session.currentIndex + 1]} isBackground />}
            <SwipeCard pet={currentPet} onSwipe={handleSwipe} swipeDirection={direction} matchScore={getMatchScore(currentPet, session.profile)} />
          </>
        )}
      </main>

      <footer className="action-buttons">
        {!isFinished && activeView === 'swipe' && (
          <>
            <button className="action-btn nope" onClick={() => handleSwipe('left')} aria-label="Pass"><span>✕</span></button>
            <button className="action-btn like" onClick={() => handleSwipe('right')} aria-label="Like"><span>❤️</span></button>
          </>
        )}
      </footer>
      {showMatch && <MatchModal pet={showMatch} onClose={() => setShowMatch(null)} />}
    </div>
  )
}

export default App
