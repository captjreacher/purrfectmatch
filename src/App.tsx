import './App.css'

export default function App() {
  return (
    <main className="landing-app">
      <section className="landing-card marketing-card">
        <nav className="marketing-nav">
          <div className="mini-brand"><span>🐾</span><strong>PetFilth</strong></div>
          <div className="nav-actions">
            <button>Login</button>
            <button className="nav-primary">Sign up</button>
          </div>
        </nav>

        <div className="landing-hero marketing-hero">
          <div className="hero-badge">PetFilth staging recovery build</div>
          <h1>Dating for pets. Supervised badly by humans.</h1>
          <p className="landing-subtitle">Find your pet a match that passes the sniff test.</p>
          <p className="landing-body">
            Build a pet-first profile, swipe through questionable companions, and unlock suspicious translations from woof, meow and sniff.
          </p>
          <div className="hero-proof-row">
            <span>⚡ Frontend only</span>
            <span>🔒 Browser-first</span>
            <span>🐶 Pet logic</span>
          </div>
        </div>

        <div className="feature-grid feature-grid-marketing">
          <div className="feature-card"><div className="feature-icon">👃</div><div className="feature-text"><strong>Sniff-first matching</strong><span>Compatibility based on vibes, snacks, nap zones and suspicious behaviour.</span></div></div>
          <div className="feature-card"><div className="feature-icon">🦴</div><div className="feature-text"><strong>Pet-only profile data</strong><span>Dead food preferences, chase targets, outfit tolerance, and human staff notes.</span></div></div>
          <div className="feature-card"><div className="feature-icon">💬</div><div className="feature-text"><strong>Bark-to-human messaging</strong><span>Default to woof woof or meow meow. Human translation is a premium problem.</span></div></div>
        </div>

        <section className="comparison-section">
          <h2 className="comparison-title">Human dating vs pet dating</h2>
          <ul className="comparison-list">
            <li className="comparison-row"><div className="comparison-side humans"><span className="comparison-tag">Humans</span><span className="comparison-text">What do you do for work?</span></div><div className="comparison-side pets"><span className="comparison-tag">Pets</span><span className="comparison-text">Can you open the treat cupboard?</span></div></li>
            <li className="comparison-row"><div className="comparison-side humans"><span className="comparison-tag">Humans</span><span className="comparison-text">What are your values?</span></div><div className="comparison-side pets"><span className="comparison-tag">Pets</span><span className="comparison-text">Where do you stand on dead birds?</span></div></li>
          </ul>
        </section>

        <div className="landing-ctas hero-ctas">
          <button className="primary-btn" onClick={() => window.alert('Sign up flow restored next')}>Start matching</button>
          <button className="ghost-cta" onClick={() => window.alert('Demo pet flow restored next')}>Try demo pet</button>
        </div>

        <p className="landing-footnote">Stable recovery page. Next commit can safely reintroduce app state and swipe flow.</p>
      </section>
    </main>
  )
}
