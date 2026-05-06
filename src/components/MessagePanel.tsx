import { useEffect, useMemo, useRef, useState } from 'react'
import { Pet } from '../data/pets'
import { PetMessage, SpeciesVoice } from '../appState'
import './MessagePanel.css'

interface MessagePanelProps {
  pet: Pet
  voice: SpeciesVoice
  messages: PetMessage[]
  onSend: (text: string) => void
  onClose: () => void
}

const VOICE_GREETINGS: Record<SpeciesVoice, string> = {
  woof: 'woof woof',
  meow: 'meow meow',
  sniff: 'sniff sniff',
}

const FAKE_TRANSLATIONS: Record<SpeciesVoice, string[]> = {
  woof: [
    'I like your energy. Do you have snacks?',
    'I will be obsessively loyal in exchange for one (1) treat.',
    'Should we run for no reason. Right now. Together.',
  ],
  meow: [
    'I have reviewed your profile and may permit one interaction.',
    'You are acceptable. Do not make eye contact.',
    'I expect three meals and zero questions.',
  ],
  sniff: [
    'You smell interesting and possibly edible.',
    'Reserved opinion. Pending further sniff data.',
    'You are not a vacuum. That is a green flag.',
  ],
}

function bubbleVoiceFor(message: PetMessage, voice: SpeciesVoice): SpeciesVoice {
  // Owner-side bubbles speak the user's voice; pet-side bubbles speak whatever feels right based on the pet
  if (message.from === 'you') return voice
  // Heuristic: if the bubble text contains "meow"/"woof"/"sniff", use that
  const t = message.text.toLowerCase()
  if (t.includes('woof')) return 'woof'
  if (t.includes('meow')) return 'meow'
  return 'sniff'
}

function pickFake(voice: SpeciesVoice, key: string): string {
  const list = FAKE_TRANSLATIONS[voice]
  // Deterministic selection so the same bubble always reveals the same translation
  let h = 0
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) | 0
  const idx = Math.abs(h) % list.length
  return list[idx]
}

export default function MessagePanel({ pet, voice, messages, onSend, onClose }: MessagePanelProps) {
  const draftDefault = VOICE_GREETINGS[voice]
  const [draft, setDraft] = useState(draftDefault)
  const [translatedIds, setTranslatedIds] = useState<Set<string>>(new Set())
  const [showPaywall, setShowPaywall] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Reset draft when voice changes
  useEffect(() => { setDraft(VOICE_GREETINGS[voice]) }, [voice])

  // Auto-scroll to latest bubble
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  const seededBubbles = useMemo<PetMessage[]>(() => {
    // If there are no real messages yet, show a couple of fake intro bubbles for vibe
    if (messages.length > 0) return messages
    return [
      { id: `seed-${pet.id}-1`, petId: pet.id, from: 'them', text: VOICE_GREETINGS[bubbleVoiceForPet(pet)] },
      { id: `seed-${pet.id}-2`, petId: pet.id, from: 'them', text: `${VOICE_GREETINGS[bubbleVoiceForPet(pet)]}?` },
    ]
  }, [messages, pet])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft(VOICE_GREETINGS[voice])
  }

  const handleTranslate = (msg: PetMessage) => {
    setShowPaywall(true)
    setTranslatedIds(prev => {
      const next = new Set(prev)
      next.add(msg.id)
      return next
    })
  }

  const renderBubble = (msg: PetMessage) => {
    const isYou = msg.from === 'you'
    const bubbleVoice = bubbleVoiceFor(msg, voice)
    const showTranslated = translatedIds.has(msg.id)
    const fake = pickFake(bubbleVoice, msg.text + msg.id)

    return (
      <div key={msg.id} className={`bubble-row ${isYou ? 'you' : 'them'}`}>
        <div className={`bubble ${isYou ? 'bubble-you' : 'bubble-them'}`}>
          <span className="bubble-text">{msg.text}</span>
          {!isYou && (
            <button
              className="bubble-translate-btn"
              onClick={() => handleTranslate(msg)}
            >
              {showTranslated ? 'Translation' : 'Preview translation'}
            </button>
          )}
          {showTranslated && (
            <div className="bubble-translation">
              <span className="bubble-translation-label">Suspicious AI translation</span>
              <span>{fake}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="message-overlay" role="dialog" aria-label={`Messaging ${pet.name}`}>
      <div className="message-panel">
        <header className="message-header">
          <button className="message-back" onClick={onClose} aria-label="Back to matches">←</button>
          <img className="message-avatar" src={pet.image} alt={pet.name} />
          <div className="message-who">
            <strong>{pet.name}</strong>
            <span>{pet.breed}</span>
          </div>
          <span className="voice-pill" title="Default message language">{voice}</span>
        </header>

        <div className="message-scroller" ref={scrollerRef}>
          {seededBubbles.map(renderBubble)}
        </div>

        <div className="translate-bar">
          <button
            className="translate-pro-btn"
            onClick={() => setShowPaywall(true)}
          >
            <span className="translate-icon" aria-hidden="true">✨</span>
            <span>Translate to human — $2.99</span>
          </button>
          <p className="translate-pro-note">UI-only. No real payment in this prototype.</p>
        </div>

        <div className="message-composer">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
            placeholder={VOICE_GREETINGS[voice]}
            aria-label={`Type a message in ${voice}`}
          />
          <button className="message-send" onClick={handleSend}>Send</button>
        </div>
      </div>

      {showPaywall && (
        <div className="paywall-backdrop" onClick={() => setShowPaywall(false)}>
          <div className="paywall-card" onClick={e => e.stopPropagation()}>
            <div className="paywall-icon" aria-hidden="true">💸</div>
            <h3>Premium translation is coming soon</h3>
            <p>
              For now, your pet said something emotionally unavailable about snacks.
              Payment is not enabled in this prototype.
            </p>
            <p className="paywall-sub">
              We have, however, generated a suspicious AI translation under each pet bubble for your amusement.
            </p>
            <button className="primary-btn paywall-btn" onClick={() => setShowPaywall(false)}>
              Continue eavesdropping for free
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper hoisted out: use the pet's species hint (breed text) to pick a voice
function bubbleVoiceForPet(pet: Pet): SpeciesVoice {
  const t = `${pet.breed} ${pet.bio}`.toLowerCase()
  if (t.includes('cat') || t.includes('persian') || t.includes('siamese') || t.includes('tabby')) return 'meow'
  if (t.includes('retriever') || t.includes('labrador') || t.includes('collie') || t.includes('bulldog') || t.includes('shiba') || t.includes('corgi')) return 'woof'
  return 'sniff'
}
