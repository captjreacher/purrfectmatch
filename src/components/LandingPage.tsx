import './LandingPage.css'

interface LandingPageProps {
  onCreateProfile: () => void
  onDemoPet: () => void
}

const featureCards = [
  {
    icon: '👃',
    title: 'Sniff-based compatibility',
    body: 'Because pets do not care about your LinkedIn.',
  },
  {
    icon: '📝',
    title: 'Profile questions humans would never ask',
    body: 'Favourite dead food, preferred nap zone, outfit tolerance.',
  },
  {
    icon: '💬',
    title: 'Messages in fluent bark or meow',
    body: 'Human translation available for a suspicious fee.',
  },
]

const comparisonRows: { humans: string; pets: string }[] = [
  { humans: 'What do you do for work?', pets: 'Can you open the treat cupboard?' },
  { humans: 'Do you want kids?', pets: 'Do you tolerate being sat on?' },
  { humans: 'What are your values?', pets: 'Where do you stand on dead birds?' },
  { humans: 'Looking for: good communication', pets: 'Looking for: clear barking and shared floor snacks' },
]

export default function LandingPage({ onCreateProfile, onDemoPet }: LandingPageProps) {
  return (
    <div className="landing-app">
      <div className="landing-card">
        <div className="landing-hero">
          <div className="landing-logo"><span className="landing-logo-icon">🐾</span><h1>PetFilth</h1></div>
          <p className="landing-subtitle">Dating for pets. Supervised badly by humans.</p>
          <p className="landing-body">
            Build your pet's profile, swipe through questionable companions, and see who passes the sniff test.
          </p>
        </div>

        <div className="feature-grid">
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
          <h2 className="comparison-title">Pet dating is different</h2>
          <ul className="comparison-list">
            {comparisonRows.map((row, i) => (
              <li key={i} className="comparison-row">
                <div className="comparison-side humans">
                  <span className="comparison-tag">Humans</span>
                  <span className="comparison-text">{row.humans}</span>
                </div>
                <div className="comparison-side pets">
                  <span className="comparison-tag">Pets</span>
                  <span className="comparison-text">{row.pets}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="landing-ctas">
          <button className="primary-btn" onClick={onCreateProfile}>Create pet profile</button>
          <button className="ghost-cta" onClick={onDemoPet}>Start with demo pet</button>
        </div>

        <p className="landing-footnote">
          No accounts, no backends. Your pet's data lives in this browser only.
        </p>
      </div>
    </div>
  )
}
