import { useState, useCallback, useEffect } from 'react'
import SwipeCard from './components/SwipeCard'
import MatchModal from './components/MatchModal'
import LandingPage from './components/LandingPage'
import MessagePanel from './components/MessagePanel'
import { pets, Pet } from './data/pets'
import {
  defaultProfile,
  demoProfile,
  defaultVoiceForSpecies,
  getCompatibilityLabel,
  getMatchScore,
  isDeterministicMatch,
  mergeProfile,
  PetMessage,
  PetProfile,
  SpeciesVoice,
  SwipeRecord,
} from './appState'
import './App.css'

const STORAGE_KEY = 'petfilth-lite-session'

type SavedSession = {
  profile: PetProfile
  currentIndex: number
  matches: Pet[]
  history: SwipeRecord[]
  onboarded: boolean
  hasSeenLanding: boolean
  messages: PetMessage[]
}

function createInitialSession(): SavedSession {
  return {
    profile: defaultProfile,
    currentIndex: 0,
    matches: [],
    history: [],
    onboarded: false,
    hasSeenLanding: false,
    messages: [],
  }
}

function loadSession(): SavedSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialSession()

    const parsed = JSON.parse(raw) as Partial<SavedSession>
    return {
      profile: mergeProfile(parsed.profile),
      currentIndex: Number.isFinite(parsed.currentIndex) ? Number(parsed.currentIndex) : 0,
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      onboarded: Boolean(parsed.onboarded),
      hasSeenLanding: Boolean(parsed.hasSeenLanding),
      messages: Array.isArray(parsed.messages) ? parsed.messages.filter(isPetMessageLike) : [],
    }
  } catch {
    return createInitialSession()
  }
}

function isPetMessageLike(m: unknown): m is PetMessage {
  if (!m || typeof m !== 'object') return false
  const o = m as Record<string, unknown>
  return typeof o.id === 'string'
    && typeof o.petId === 'number'
    && (o.from === 'you' || o.from === 'them')
    && typeof o.text === 'string'
}

function makeMessageId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function App() {
  const [session, setSession] = useState<SavedSession>(() => loadSession())
  const [showMatch, setShowMatch] = useState<Pet | null>(null)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [activeView, setActiveView] = useState<'swipe' | 'matches'>('swipe')
  const [messagingPet, setMessagingPet] = useState<Pet | null>(null)

  const currentPet = pets[session.currentIndex]
  const isFinished = session.currentIndex >= pets.length
  const progress = Math.min(session.currentIndex + 1, pets.length)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  const setProfile = (profile: PetProfile) => {
    setSession(prev => ({ ...prev, profile }))
  }

  const updateProfileField = <K extends keyof PetProfile>(key: K, value: PetProfile[K]) => {
    setSession(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }))
  }

  const startApp = () => setSession(prev => ({ ...prev, onboarded: true }))

  const handleCreateProfile = () => {
    setSession(prev => ({ ...prev, hasSeenLanding: true }))
  }

  const handleDemoPet = () => {
    setSession(prev => ({
      ...prev,
      hasSeenLanding: true,
      profile: { ...demoProfile },
    }))
  }

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
    setMessagingPet(null)
  }

  const handleSendMessage = (text: string) => {
    if (!messagingPet) return
    const newMessage: PetMessage = {
      id: makeMessageId(),
      petId: messagingPet.id,
      from: 'you',
      text,
    }
    // Auto-reply: pet echoes its native voice with light variation
    const replyVoice: SpeciesVoice = bubbleVoiceForPet(messagingPet)
    const replyText = pickAutoReply(replyVoice)
    const reply: PetMessage = {
      id: makeMessageId(),
      petId: messagingPet.id,
      from: 'them',
      text: replyText,
    }
    setSession(prev => ({ ...prev, messages: [...prev.messages, newMessage, reply] }))
  }

  const messagesForCurrentPet = messagingPet
    ? session.messages.filter(m => m.petId === messagingPet.id)
    : []

  // 1) Landing
  if (!session.hasSeenLanding) {
    return <LandingPage onCreateProfile={handleCreateProfile} onDemoPet={handleDemoPet} />
  }

  // 2) Onboarding — single screen, expanded with pet-specific quirks
  if (!session.onboarded) {
    const profile = session.profile
    return (
      <div className="app onboarding-app">
        <section className="onboarding-card">
          <div className="eyebrow">PetFilth · Profile</div>
          <h1>Set up your pet.</h1>
          <p className="intro">
            We ask the questions humans would never think to ask. Stays in your browser. No account required.
          </p>

          <div className="form-section">
            <div className="form-section-title">The basics</div>

            <label>
              Pet name
              <input
                value={profile.petName}
                onChange={e => updateProfileField('petName', e.target.value)}
                placeholder="Milo, Biscuit, Lord Whiskerton III"
              />
            </label>

            <label>
              Looking for
              <select
                value={profile.species}
                onChange={e => {
                  const species = e.target.value as PetProfile['species']
                  setProfile({ ...profile, species, speciesVoice: defaultVoiceForSpecies(species) })
                }}
              >
                <option value="Any">Any</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </label>

            <label>
              Your pet's vibe
              <textarea
                value={profile.vibe}
                onChange={e => updateProfileField('vibe', e.target.value)}
                rows={2}
                placeholder="Chaotic good. Snack-led. Emotionally available between naps."
              />
            </label>

            <label>
              What they're looking for
              <textarea
                value={profile.lookingFor}
                onChange={e => updateProfileField('lookingFor', e.target.value)}
                rows={2}
                placeholder="Walks, couch time, play dates and questionable decisions."
              />
            </label>
          </div>

          <div className="form-section">
            <div className="form-section-title">Pet-only questions</div>

            <label>
              Favourite food once it stops running
              <input
                value={profile.foodWhenDead}
                onChange={e => updateProfileField('foodWhenDead', e.target.value)}
                placeholder="Chicken, steak, anything dropped near the BBQ"
              />
            </label>

            <label>
              Favourite food while it is still making poor life choices
              <input
                value={profile.foodToChase}
                onChange={e => updateProfileField('foodToChase', e.target.value)}
                placeholder="Birds, flies, suspicious shadows, the postie"
              />
            </label>

            <label>
              Fashion tolerance
              <input
                list="fashion-styles"
                value={profile.fashionStyle}
                onChange={e => updateProfileField('fashionStyle', e.target.value)}
                placeholder="Naked and proud, Bandana acceptable, Designer chaos…"
              />
              <datalist id="fashion-styles">
                <option value="Naked and proud" />
                <option value="Bandana acceptable" />
                <option value="Designer chaos" />
                <option value="Will remove jumper immediately" />
                <option value="Seasonal humiliation only" />
              </datalist>
            </label>

            <label>
              Preferred sleeping arrangement
              <input
                list="sleeping-spots"
                value={profile.sleepingSpot}
                onChange={e => updateProfileField('sleepingSpot', e.target.value)}
                placeholder="Human bed centre position, sunny patch, laundry basket…"
              />
              <datalist id="sleeping-spots">
                <option value="Luxury bed ignored" />
                <option value="Human bed, centre position" />
                <option value="Laundry basket" />
                <option value="Sunny patch" />
                <option value="Anywhere inconvenient" />
              </datalist>
            </label>

            <label>
              Human staff notes
              <textarea
                value={profile.ownerNotes}
                onChange={e => updateProfileField('ownerNotes', e.target.value)}
                rows={2}
                placeholder="Owner has thumbs, transport, treats, and unresolved attachment issues."
              />
            </label>

            <label>
              Immediate red flags
              <textarea
                value={profile.datingRedFlags}
                onChange={e => updateProfileField('datingRedFlags', e.target.value)}
                rows={2}
                placeholder="Vacuum enthusiasm, bath positivity, sharing toys too easily."
              />
            </label>

            <label>
              Default message language
              <select
                value={profile.speciesVoice}
                onChange={e => updateProfileField('speciesVoice', e.target.value as SpeciesVoice)}
              >
                <option value="woof">woof</option>
                <option value="meow">meow</option>
                <option value="sniff">sniff</option>
              </select>
            </label>
          </div>

          <button className="primary-btn" onClick={startApp}>Start swiping</button>
          <button className="ghost-cta onboarding-ghost" onClick={hardReset}>Back to landing</button>
        </section>
      </div>
    )
  }

  // 3) Main app: swipe + matches
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
            {session.matches.length === 0 ? (
              <p>No matches yet. Like pets with a strong compatibility score.</p>
            ) : (
              session.matches.map(pet => {
                const score = getMatchScore(pet, session.profile)
                return (
                  <article key={pet.id} className="match-row">
                    <img src={pet.image} alt={pet.name} />
                    <div className="match-row-meta">
                      <strong>{pet.name}</strong>
                      <span>{pet.breed} · {score}% · {getCompatibilityLabel(score)}</span>
                    </div>
                    <button
                      className="message-btn"
                      onClick={() => setMessagingPet(pet)}
                      aria-label={`Message ${pet.name}`}
                    >
                      Message
                    </button>
                  </article>
                )
              })
            )}
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
      {messagingPet && (
        <MessagePanel
          pet={messagingPet}
          voice={session.profile.speciesVoice}
          messages={messagesForCurrentPet}
          onSend={handleSendMessage}
          onClose={() => setMessagingPet(null)}
        />
      )}
    </div>
  )
}

// Helpers (top-level for hoisting)
function bubbleVoiceForPet(pet: Pet): SpeciesVoice {
  const t = `${pet.breed} ${pet.bio}`.toLowerCase()
  if (t.includes('cat') || t.includes('persian') || t.includes('siamese') || t.includes('tabby')) return 'meow'
  if (t.includes('retriever') || t.includes('labrador') || t.includes('collie') || t.includes('bulldog') || t.includes('shiba') || t.includes('corgi')) return 'woof'
  return 'sniff'
}

function pickAutoReply(voice: SpeciesVoice): string {
  const variants: Record<SpeciesVoice, string[]> = {
    woof: ['woof woof!', 'woof.', 'woof woof woof', 'woof?'],
    meow: ['meow', 'meow meow', 'meow.', 'mrrrow'],
    sniff: ['sniff sniff', 'sniff?', 'sniff.', 'sniff sniff sniff'],
  }
  const list = variants[voice]
  return list[Math.floor(Math.random() * list.length)]
}

export default App
