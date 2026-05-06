import './App.css'

export default function App() {
  const showPrototypeNotice = () => {
    window.alert('Prototype action only. Signup, login, and matching flows will be wired back in the next build pass.')
  }

  return (
    <main className="home-page">
      <section className="home-shell">
        <nav className="home-nav">
          <div className="home-brand"><span>🐾</span><strong>PetFilth</strong></div>
          <div className="home-nav-actions">
            <button type="button" onClick={showPrototypeNotice}>Login</button>
            <button type="button" onClick={showPrototypeNotice} className="home-nav-primary">Sign up</button>
          </div>
        </nav>

        <section className="home-hero">
          <div className="home-badge">Dating app logic, but pets are in charge</div>
          <h1>Dating for pets. Supervised badly by humans.</h1>
          <p className="home-subtitle">Find your pet a match that passes the sniff test.</p>
          <p className="home-copy">
            Build a pet-first profile, swipe through questionable companions, and unlock suspicious translations from woof, meow and sniff.
          </p>
          <div className="home-proof-row">
            <span>⚡ Frontend only</span>
            <span>🔒 Browser-first</span>
            <span>🐶 Pet logic</span>
          </div>
          <div className="home-cta-row">
            <button type="button" className="home-primary" onClick={showPrototypeNotice}>Start matching</button>
            <button type="button" className="home-secondary" onClick={showPrototypeNotice}>Try demo pet</button>
          </div>
        </section>

        <section className="home-section">
          <h2>Built for questions humans forgot to ask.</h2>
          <p>
            Human dating apps ask about careers, values and travel. Pets care about snacks, sleeping rights, furniture access, prey drive and whether your owner has transport.
          </p>
        </section>

        <section className="home-grid">
          <article className="home-feature"><span>👃</span><div><strong>Sniff-first matching</strong><p>Compatibility based on vibes, snacks, nap zones and suspicious behaviour.</p></div></article>
          <article className="home-feature"><span>🦴</span><div><strong>Pet-only profile data</strong><p>Dead food preferences, chase targets, outfit tolerance, and human staff notes.</p></div></article>
          <article className="home-feature"><span>💬</span><div><strong>Bark-to-human messaging</strong><p>Default to woof woof or meow meow. Human translation is a premium problem.</p></div></article>
          <article className="home-feature"><span>🛏️</span><div><strong>Lifestyle fit</strong><p>Because sharing a sunny patch matters more than sharing a mortgage.</p></div></article>
        </section>

        <section className="home-compare">
          <h2>Human dating vs pet dating</h2>
          <div className="home-compare-row"><div><small>Humans</small><span>What do you do for work?</span></div><div><small>Pets</small><span>Can you open the treat cupboard?</span></div></div>
          <div className="home-compare-row"><div><small>Humans</small><span>What are your values?</span></div><div><small>Pets</small><span>Where do you stand on dead birds?</span></div></div>
          <div className="home-compare-row"><div><small>Humans</small><span>Do you like travel?</span></div><div><small>Pets</small><span>Do you scream in the car?</span></div></div>
        </section>

        <section className="home-premium">
          <span>Premium tease</span>
          <strong>Translate “woof woof” into human for $2.99.</strong>
          <p>Prototype only for now. Your pet probably said something emotionally unavailable about snacks.</p>
        </section>
      </section>
    </main>
  )
}
