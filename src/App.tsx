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
  auth?: {
    email: string
    mode: 'signup' | 'login'
  }
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
      auth: parsed.auth,
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

  const handleAuthComplete = (email: string, mode: 'signup' | 'login') => {
    setSession(prev => ({
      ...prev,
      hasSeenLanding: true,
      auth: { email, mode },
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

  if (!session.hasSeenLanding) {
    return <LandingPage onCreateProfile={handleCreateProfile} onDemoPet={handleDemoPet} onAuthComplete={handleAuthComplete} />
  }

  return <div className="app"><div style={{color:'white',padding:'20px'}}>PetFilth live</div></div>
}

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
