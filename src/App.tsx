import { useMemo, useState } from 'react'
import { pets, Pet } from './data/pets'

type View = 'home' | 'auth' | 'profile' | 'swipe' | 'matches'
type AuthMode = 'signup' | 'login'
type Voice = 'woof' | 'meow' | 'sniff'

type Profile = {
  petName: string
  species: 'Any' | 'Dog' | 'Cat'
  vibe: string
  foodDead: string
  foodChase: string
  fashion: string
  sleep: string
  owner: string
  voice: Voice
}

const defaultProfile: Profile = {
  petName: 'Biscuit',
  species: 'Any',
  vibe: 'Chaotic good, snack-led, emotionally available between naps',
  foodDead: 'Chicken, steak, anything dropped near the BBQ',
  foodChase: 'Birds, flies, suspicious shadows, the postie',
  fashion: 'Bandana acceptable, jumper removed immediately',
  sleep: 'Human bed, centre position',
  owner: 'Has thumbs, transport, treats, and unresolved attachment issues',
  voice: 'woof',
}

function petSpecies(pet: Pet): 'Dog' | 'Cat' {
  const text = `${pet.breed} ${pet.bio}`.toLowerCase()
  return text.includes('cat') || text.includes('persian') || text.includes('siamese') || text.includes('tabby') ? 'Cat' : 'Dog'
}

function scorePet(pet: Pet, profile: Profile): number {
  const petText = `${pet.breed} ${pet.bio} ${pet.traits.join(' ')}`.toLowerCase()
  const profileText = Object.values(profile).join(' ').toLowerCase()
  let score = 50
  if (profile.species !== 'Any' && petSpecies(pet) === profile.species) score += 12
  if (profileText.includes('couch') || profileText.includes('bed') || profileText.includes('nap')) {
    if (petText.includes('lazy') || petText.includes('snuggly') || petText.includes('nap')) score += 12
  }
  if (profileText.includes('chaos') || profileText.includes('chase') || profileText.includes('postie')) {
    if (petText.includes('playful') || petText.includes('energetic') || petText.includes('stubborn')) score += 10
  }
  if (petText.includes('loyal') || petText.includes('cuddly')) score += 8
  if (petText.includes('mysterious') || petText.includes('sassy') || petText.includes('dramatic')) score += 5
  return Math.max(35, Math.min(96, score))
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Strong sniff'
  if (score >= 68) return 'Worth a sniff'
  if (score >= 55) return 'Questionable chemistry'
  return 'Polite tail wag'
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [authMode, setAuthMode] = useState<AuthMode>('signup')
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [index, setIndex] = useState(0)
  const [matches, setMatches] = useState<Pet[]>([])
  const [messagePet, setMessagePet] = useState<Pet | null>(null)
  const [translation, setTranslation] = useState('')

  const currentPet = pets[index]
  const currentScore = currentPet ? scorePet(currentPet, profile) : 0
  const nativeMessage = profile.voice === 'meow' ? 'meow meow' : profile.voice === 'woof' ? 'woof woof' : 'sniff sniff'

  const styles = useMemo(() => ({
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#667eea,#764ba2)', padding: '18px', fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif', boxSizing: 'border-box' as const, color: '#222' },
    shell: { maxWidth: '440px', margin: '0 auto', background: '#fff', borderRadius: '28px', padding: '24px', boxShadow: '0 18px 60px rgba(0,0,0,.22)' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '22px' },
    brand: { display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 900, fontSize: '1.2rem' },
    row: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
    btn: { border: 0, borderRadius: '999px', padding: '12px 16px', fontWeight: 900, cursor: 'pointer' },
    primary: { border: 0, borderRadius: '999px', padding: '15px 18px', fontWeight: 900, color: '#fff', background: 'linear-gradient(135deg,#667eea,#764ba2)', width: '100%', marginTop: '10px', fontSize: '1rem', boxShadow: '0 10px 30px rgba(102,126,234,.35)' },
    secondary: { border: '2px solid #e6dcf5', borderRadius: '999px', padding: '13px 18px', fontWeight: 900, color: '#6741a5', background: '#fff', width: '100%', marginTop: '10px', fontSize: '1rem' },
    h1: { fontSize: '2.35rem', lineHeight: 1.04, letterSpacing: '-.05em', margin: '0 0 12px' },
    h2: { fontSize: '1.45rem', margin: '0 0 12px' },
    copy: { color: '#555', lineHeight: 1.5, fontSize: '1rem' },
    badge: { display: 'inline-block', background: '#f1eafe', color: '#6741a5', borderRadius: '999px', padding: '8px 12px', fontSize: '.78rem', fontWeight: 900, marginBottom: '14px' },
    card: { background: '#f8f5ff', border: '1px solid #e6dcf5', borderRadius: '18px', padding: '14px', marginBottom: '10px' },
    input: { width: '100%', boxSizing: 'border-box' as const, border: '1px solid #ddd', borderRadius: '14px', padding: '12px', fontSize: '1rem', marginTop: '6px', marginBottom: '12px' },
    label: { display: 'block', fontWeight: 800, color: '#333' },
    image: { width: '100%', height: '310px', objectFit: 'cover' as const, borderRadius: '22px' },
    topTabs: { display: 'flex', gap: '8px', marginBottom: '14px' },
    tab: { flex: 1, border: '1px solid #e6dcf5', borderRadius: '999px', padding: '10px', background: '#fff', fontWeight: 900 },
    overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.55)', display: 'grid', placeItems: 'center', padding: '18px', zIndex: 10 },
  }), [])

  const startAuth = (mode: AuthMode) => { setAuthMode(mode); setView('auth') }
  const completeAuth = () => setView('profile')
  const updateProfile = (key: keyof Profile, value: string) => setProfile(prev => ({ ...prev, [key]: value } as Profile))
  const swipe = (liked: boolean) => {
    if (!currentPet) return
    if (liked && currentScore >= 68 && !matches.some(p => p.id === currentPet.id)) setMatches(prev => [...prev, currentPet])
    setIndex(prev => prev + 1)
  }
  const resetAll = () => { setView('home'); setEmail(''); setProfile(defaultProfile); setIndex(0); setMatches([]); setMessagePet(null); setTranslation('') }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <nav style={styles.nav}>
          <div style={styles.brand}><span>🐾</span><strong>purrfectMatch</strong></div>
          <div style={styles.row}>
            <button style={{ ...styles.btn, background: '#fff', border: '1px solid #ddd' }} onClick={() => startAuth('login')}>Login</button>
            <button style={{ ...styles.btn, background: '#111827', color: '#fff' }} onClick={() => startAuth('signup')}>Sign up</button>
          </div>
        </nav>

        {view === 'home' && (
          <>
            <div style={styles.badge}>Dating app logic, but pets are in charge</div>
            <h1 style={styles.h1}>Dating for pets. Supervised badly by humans.</h1>
            <p style={{ ...styles.copy, fontWeight: 800, color: '#ff6b6b' }}>Find your pet a match that passes the sniff test.</p>
            <p style={styles.copy}>Build a pet-first profile, swipe through questionable companions, and unlock suspicious translations from woof, meow and sniff.</p>
            <button style={styles.primary} onClick={() => startAuth('signup')}>Start matching</button>
            <button style={styles.secondary} onClick={() => { setProfile(defaultProfile); setView('profile') }}>Try demo pet</button>
            <section style={{ marginTop: '22px' }}>
              {[
                ['👃', 'Sniff-first matching', 'Compatibility based on vibes, snacks, nap zones and suspicious behaviour.'],
                ['🦴', 'Pet-only profile data', 'Dead food preferences, chase targets, outfit tolerance, and human staff notes.'],
                ['💬', 'Bark-to-human messaging', 'Default to woof woof or meow meow. Human translation is a premium problem.'],
              ].map(([icon, title, text]) => <article key={title} style={styles.card}><strong>{icon} {title}</strong><p style={{ ...styles.copy, margin: '6px 0 0' }}>{text}</p></article>)}
            </section>
          </>
        )}

        {view === 'auth' && (
          <>
            <div style={styles.badge}>{authMode === 'signup' ? 'Join the pack' : 'Back to the kennel'}</div>
            <h1 style={styles.h1}>{authMode === 'signup' ? 'Create account.' : 'Log in.'}</h1>
            <p style={styles.copy}>Prototype auth is local only for now. Real accounts come later.</p>
            <label style={styles.label}>Human email<input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="human@example.com" /></label>
            <button style={styles.primary} onClick={completeAuth}>{authMode === 'signup' ? 'Sign up and continue' : 'Login and continue'}</button>
            <button style={styles.secondary} onClick={() => setView('home')}>Back</button>
          </>
        )}

        {view === 'profile' && (
          <>
            <div style={styles.badge}>purrfectMatch profile</div>
            <h1 style={styles.h1}>Set up your pet.</h1>
            <label style={styles.label}>Pet name<input style={styles.input} value={profile.petName} onChange={e => updateProfile('petName', e.target.value)} /></label>
            <label style={styles.label}>Looking for<select style={styles.input} value={profile.species} onChange={e => updateProfile('species', e.target.value)}><option>Any</option><option>Dog</option><option>Cat</option></select></label>
            <label style={styles.label}>Your pet's vibe<textarea style={styles.input} value={profile.vibe} onChange={e => updateProfile('vibe', e.target.value)} /></label>
            <label style={styles.label}>Favourite food once it stops running<input style={styles.input} value={profile.foodDead} onChange={e => updateProfile('foodDead', e.target.value)} /></label>
            <label style={styles.label}>Favourite food to chase<input style={styles.input} value={profile.foodChase} onChange={e => updateProfile('foodChase', e.target.value)} /></label>
            <label style={styles.label}>Fashion tolerance<input style={styles.input} value={profile.fashion} onChange={e => updateProfile('fashion', e.target.value)} /></label>
            <label style={styles.label}>Preferred sleeping arrangement<input style={styles.input} value={profile.sleep} onChange={e => updateProfile('sleep', e.target.value)} /></label>
            <label style={styles.label}>Human staff notes<textarea style={styles.input} value={profile.owner} onChange={e => updateProfile('owner', e.target.value)} /></label>
            <label style={styles.label}>Default message language<select style={styles.input} value={profile.voice} onChange={e => updateProfile('voice', e.target.value)}><option value="woof">woof</option><option value="meow">meow</option><option value="sniff">sniff</option></select></label>
            <button style={styles.primary} onClick={() => { setIndex(0); setMatches([]); setView('swipe') }}>Start swiping</button>
          </>
        )}

        {(view === 'swipe' || view === 'matches') && (
          <>
            <div style={styles.topTabs}>
              <button style={{ ...styles.tab, background: view === 'swipe' ? '#f1eafe' : '#fff' }} onClick={() => setView('swipe')}>Swipe</button>
              <button style={{ ...styles.tab, background: view === 'matches' ? '#f1eafe' : '#fff' }} onClick={() => setView('matches')}>❤️ {matches.length}</button>
            </div>
            {view === 'swipe' && currentPet && <>
              <img style={styles.image} src={currentPet.image} alt={currentPet.name} />
              <h2 style={{ ...styles.h2, marginTop: '14px' }}>{currentPet.name}, {currentPet.age}</h2>
              <div style={styles.badge}>{currentScore}% · {scoreLabel(currentScore)}</div>
              <p style={styles.copy}><strong>{currentPet.breed}</strong><br />{currentPet.bio}</p>
              <div style={styles.row}>{currentPet.traits.map(t => <span key={t} style={{ ...styles.badge, marginBottom: 0 }}>{t}</span>)}</div>
              <div style={{ ...styles.row, marginTop: '18px' }}><button style={{ ...styles.secondary, flex: 1 }} onClick={() => swipe(false)}>Pass</button><button style={{ ...styles.primary, flex: 1, marginTop: 0 }} onClick={() => swipe(true)}>Like</button></div>
            </>}
            {view === 'swipe' && !currentPet && <><h1 style={styles.h1}>Queue complete.</h1><p style={styles.copy}>{profile.petName} matched with {matches.length} pet{matches.length === 1 ? '' : 's'}.</p><button style={styles.primary} onClick={() => { setIndex(0); setMatches([]) }}>Run again</button><button style={styles.secondary} onClick={resetAll}>Reset all</button></>}
            {view === 'matches' && <><h1 style={styles.h1}>Your matches.</h1>{matches.length === 0 ? <p style={styles.copy}>No matches yet. Go like someone with a strong sniff.</p> : matches.map(p => <article key={p.id} style={styles.card}><strong>{p.name}</strong><p style={styles.copy}>{p.breed} · {scorePet(p, profile)}% fit</p><button style={styles.secondary} onClick={() => setMessagePet(p)}>Message</button></article>)}</>}
          </>
        )}
      </section>
      {messagePet && <div style={styles.overlay} onClick={() => setMessagePet(null)}><section style={{ ...styles.shell, width: '100%' }} onClick={e => e.stopPropagation()}><h2 style={styles.h2}>Message {messagePet.name}</h2><article style={styles.card}><strong>{messagePet.name}</strong><p style={styles.copy}>{nativeMessage}</p></article><article style={styles.card}><strong>You</strong><p style={styles.copy}>{nativeMessage}</p></article>{translation && <article style={styles.card}><strong>Suspicious AI translation</strong><p style={styles.copy}>{translation}</p></article>}<button style={styles.primary} onClick={() => setTranslation(profile.voice === 'meow' ? 'I have reviewed your profile and may permit one interaction.' : profile.voice === 'woof' ? 'I like your energy. Do you have snacks?' : 'You smell interesting and possibly edible.')}>Translate to human — $2.99</button><button style={styles.secondary} onClick={() => setMessagePet(null)}>Close</button></section></div>}
    </main>
  )
}
