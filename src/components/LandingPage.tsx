import { useState } from 'react'
import './LandingPage.css'

interface LandingPageProps {
  onCreateProfile: () => void
  onDemoPet: () => void
  onAuthComplete: (email: string, mode: 'signup' | 'login') => void
}

const featureCards = [
  { icon: '👃', title: 'Sniff-first matching', body: 'Compatibility based on vibes, snacks, nap zones and suspicious behaviour.' },
  { icon: '🦴', title: 'Pet-only profile data', body: 'Dead food preferences, chase targets, outfit tolerance, and human staff notes.' },
  { icon: '💬', title: 'Bark-to-human messaging', body: 'Default to woof woof or meow meow. Human translation is a premium problem.' },
  { icon: '🛏️', title: 'Lifestyle fit', body: 'Because sharing a sunny patch matters more than sharing a mortgage.' },
]

const comparisonRows: { humans: string; pets: string }[] = [
  { humans: 'What do you do for work?', pets: 'Can you open the treat cupboard?' },
  { humans: 'What are your values?', pets: 'Where do you stand on dead birds?' },
  { humans: 'Do you like travel?', pets: 'Do you scream in the car?' },
  { humans: 'Good communication', pets: 'Clear barking and shared floor snacks' },
]

function AuthPanel({ mode, onAuthComplete }: { mode: 'signup' | 'login'; onAuthComplete: LandingPageProps['onAuthComplete'] }) {
  const [email, setEmail] = useState('')
  const [petName, setPetName] = useState('')

  const submit = () => {
    const fallbackEmail = mode === 'signup' && petName ? `${petName.toLowerCase().replace(/\s+/g, '.')}@petmail.local` : 'guest@purrfectmatch.local'
    onAuthComplete(email.trim() || fallbackEmail, mode)
  }

  return (
    <div className="auth-panel">
      <div>
        <span className="auth-kicker">{mode === 'signup' ? 'Join the pack' : 'Back to the kennel'}</span>
        <h3>{mode === 'signup' ? 'Create a human-supervised account.' : 'Log back in.'}</h3>
        <p>{mode === 'signup' ? 'No real backend yet — this prototype saves locally while we prove the loop.' : 'Prototype login restores the local pet flow on this browser.'}</p>
      </div>
      {mode === 'signup' && (
        <input value={petName} onChange={e => setPetName(e.target.value)} placeholder="Pet name" />
      )}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Human email" type="email" />
      <button className="primary-btn" onClick={submit}>{mode === 'signup' ? 'Sign up and build profile' : 'Login and continue'}</button>
    </div>
  )
}

export default function LandingPage({ onCreateProfile, onDemoPet, onAuthComplete }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')

  return (
    <div className="landing-app">
      <div className="landing-card marketing-card">
        <nav className="marketing-nav">
          <div className="mini-brand"><span>🐾</span><strong>purrfectMatch</strong></div>
          <div className="nav-actions">
            <button onClick={() => setAuthMode('login')}>Login</button>
            <button className="nav-primary" onClick={() => setAuthMode('signup')}>Sign up</button>
          </div>
        </nav>

        <div className="landing-hero marketing-hero">
          <div className="hero-badge">Dating app logic, but pets are in charge</div>
          <h1>Find your pet a match that passes the sniff test.</h1>
          <p className="landing-subtitle">Dating for pets. Supervised badly by humans.</p>
          <p className="landing-body">
            Build a ridiculous but useful profile, swipe through questionable companions, match on personality, and message in fluent bark, meow or suspicious sniff.
          </p>
          <div className="hero-proof-row">
            <span>⚡ No download</span>
            <span>🔒 Browser-first</span>
            <span>🐶 Pet logic</span>
          </div>
        </div>

        <div className="landing-ctas hero-ctas">
          <button className="primary-btn" onClick={() => setAuthMode('signup')}>Start matching</button>
          <button className="ghost-cta" onClick={onDemoPet}>Try demo pet</button>
        </div>

        <AuthPanel mode={authMode} onAuthComplete={onAuthComplete} />

        <section className="marketing-section">
          <h2>Built for the questions humans forgot to ask.</h2>
          <p>Human dating apps ask about careers, values and travel. Pets care about snacks, sleeping rights, furniture access, prey drive and whether your owner has transport.</p>
        </section>

        <div className="feature-grid feature-grid-marketing">
          {featureCards.map((card) => (
            <div key={card.title} className="feature-card">
              <div className="feature-icon" aria-hidden="true">{card.icon}</div>
              <div className="feature-text">
                <strong>{card.title}</strong>
                <span>{card.body}</span>
              </div>
            </div>
          ))}
        </div>

        <section className="comparison-section">
          <h2 className="comparison-title">Human dating vs pet dating</h2>
          <ul className="comparison-list">
            {comparisonRows.map((row, i) => (
              <li key={i} className="comparison-row">
                <div className="comparison-side humans"><span className="comparison-tag">Humans</span><span className="comparison-text">{row.humans}</span></div>
                <div className="comparison-side pets"><span className="comparison-tag">Pets</span><span className="comparison-text">{row.pets}</span></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="pricing-tease">
          <span>Premium tease</span>
          <strong>Translate “woof woof” into human for $2.99.</strong>
          <p>Prototype only for now. Your pet probably said something emotionally unavailable about snacks.</p>
        </section>

        <button className="ghost-cta full-width" onClick={onCreateProfile}>Skip auth for prototype testing</button>
        <p className="landing-footnote">Local prototype: sign up/login is simulated in this browser. Real accounts can be added later.</p>
      </div>
    </div>
  )
}
