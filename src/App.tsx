export default function App() {
  const notice = () => window.alert('Prototype action only. Interactive signup and matching return in the next pass.')

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '18px',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      color: '#222',
      boxSizing: 'border-box' as const,
    },
    shell: {
      maxWidth: '440px',
      margin: '0 auto',
      background: '#fff',
      borderRadius: '28px',
      padding: '24px',
      boxShadow: '0 18px 60px rgba(0,0,0,0.22)',
    },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    brand: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '1.2rem' },
    navActions: { display: 'flex', gap: '8px' },
    smallButton: { border: '1px solid #ddd', background: '#fff', borderRadius: '999px', padding: '8px 12px', fontWeight: 800, cursor: 'pointer' },
    signButton: { border: '0', background: '#111827', color: '#fff', borderRadius: '999px', padding: '8px 12px', fontWeight: 800, cursor: 'pointer' },
    badge: { display: 'inline-block', background: '#f1eafe', color: '#6741a5', borderRadius: '999px', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 900, marginBottom: '14px' },
    h1: { fontSize: '2.7rem', lineHeight: 1.02, margin: '0 0 14px', letterSpacing: '-0.06em' },
    subtitle: { fontSize: '1.18rem', fontWeight: 800, color: '#ff6b6b', margin: '0 0 10px' },
    copy: { fontSize: '1rem', lineHeight: 1.5, color: '#555', margin: '0 0 18px' },
    proof: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px', margin: '0 0 20px' },
    proofItem: { background: '#f6f3fb', borderRadius: '999px', padding: '8px 10px', fontSize: '0.82rem', fontWeight: 800 },
    primary: { width: '100%', border: '0', borderRadius: '999px', padding: '15px 18px', fontSize: '1rem', fontWeight: 900, color: '#fff', background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 10px 30px rgba(102,126,234,0.35)', cursor: 'pointer', marginBottom: '10px' },
    secondary: { width: '100%', border: '2px solid #e6dcf5', borderRadius: '999px', padding: '13px 18px', fontSize: '1rem', fontWeight: 900, color: '#6741a5', background: '#fff', cursor: 'pointer' },
    section: { borderTop: '1px dashed #e6dcf5', marginTop: '24px', paddingTop: '20px' },
    h2: { fontSize: '1.35rem', lineHeight: 1.1, margin: '0 0 8px' },
    card: { display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8f5ff', border: '1px solid #e6dcf5', borderRadius: '18px', padding: '14px', marginBottom: '10px' },
    icon: { fontSize: '1.45rem', width: '30px', flexShrink: 0 },
    cardTitle: { display: 'block', fontWeight: 900, marginBottom: '4px' },
    cardText: { color: '#666', lineHeight: 1.35, margin: 0, fontSize: '0.92rem' },
    compareRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#faf7ff', borderRadius: '16px', padding: '12px', marginBottom: '10px' },
    tag: { display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' as const, color: '#9b8ab8', fontWeight: 900, letterSpacing: '0.08em', marginBottom: '4px' },
    premium: { background: '#111827', color: '#fff', borderRadius: '20px', padding: '18px', marginTop: '20px' },
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <nav style={styles.nav}>
          <div style={styles.brand}><span>🐾</span><strong>PetFilth</strong></div>
          <div style={styles.navActions}>
            <button type="button" style={styles.smallButton} onClick={notice}>Login</button>
            <button type="button" style={styles.signButton} onClick={notice}>Sign up</button>
          </div>
        </nav>

        <div style={styles.badge}>Dating app logic, but pets are in charge</div>
        <h1 style={styles.h1}>Dating for pets. Supervised badly by humans.</h1>
        <p style={styles.subtitle}>Find your pet a match that passes the sniff test.</p>
        <p style={styles.copy}>Build a pet-first profile, swipe through questionable companions, and unlock suspicious translations from woof, meow and sniff.</p>
        <div style={styles.proof}>
          <span style={styles.proofItem}>⚡ Frontend only</span>
          <span style={styles.proofItem}>🔒 Browser-first</span>
          <span style={styles.proofItem}>🐶 Pet logic</span>
        </div>
        <button type="button" style={styles.primary} onClick={notice}>Start matching</button>
        <button type="button" style={styles.secondary} onClick={notice}>Try demo pet</button>

        <section style={styles.section}>
          <h2 style={styles.h2}>Built for questions humans forgot to ask.</h2>
          <p style={styles.copy}>Human dating apps ask about careers, values and travel. Pets care about snacks, sleeping rights, furniture access, prey drive and whether your owner has transport.</p>
        </section>

        <section style={styles.section}>
          <article style={styles.card}><span style={styles.icon}>👃</span><div><strong style={styles.cardTitle}>Sniff-first matching</strong><p style={styles.cardText}>Compatibility based on vibes, snacks, nap zones and suspicious behaviour.</p></div></article>
          <article style={styles.card}><span style={styles.icon}>🦴</span><div><strong style={styles.cardTitle}>Pet-only profile data</strong><p style={styles.cardText}>Dead food preferences, chase targets, outfit tolerance, and human staff notes.</p></div></article>
          <article style={styles.card}><span style={styles.icon}>💬</span><div><strong style={styles.cardTitle}>Bark-to-human messaging</strong><p style={styles.cardText}>Default to woof woof or meow meow. Human translation is a premium problem.</p></div></article>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Human dating vs pet dating</h2>
          <div style={styles.compareRow}><div><small style={styles.tag}>Humans</small><span>What do you do for work?</span></div><div><small style={styles.tag}>Pets</small><span>Can you open the treat cupboard?</span></div></div>
          <div style={styles.compareRow}><div><small style={styles.tag}>Humans</small><span>What are your values?</span></div><div><small style={styles.tag}>Pets</small><span>Where do you stand on dead birds?</span></div></div>
        </section>

        <section style={styles.premium}>
          <strong>Translate “woof woof” into human for $2.99.</strong>
          <p style={{ margin: '8px 0 0', color: '#d1d5db', lineHeight: 1.45 }}>Prototype only for now. Your pet probably said something emotionally unavailable about snacks.</p>
        </section>
      </section>
    </main>
  )
}
