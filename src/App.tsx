import { useState, useCallback } from 'react'
import SwipeCard from './components/SwipeCard'
import MatchModal from './components/MatchModal'
import { pets, Pet } from './data/pets'
import './App.css'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<Pet[]>([])
  const [showMatch, setShowMatch] = useState<Pet | null>(null)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const currentPet = pets[currentIndex]
  const isFinished = currentIndex >= pets.length

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setDirection(dir)
    if (dir === 'right' && Math.random() < 0.4) {
      setMatches(prev => [...prev, currentPet])
      setTimeout(() => setShowMatch(currentPet), 300)
    }
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setDirection(null)
    }, 300)
  }, [currentPet])

  const handleReset = () => {
    setCurrentIndex(0)
    setMatches([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🐾</span>
          <h1>PetFilth</h1>
        </div>
        <p className="tagline">Let your pet get some</p>
        {matches.length > 0 && (
          <div className="match-count">
            <span className="heart">❤️</span> {matches.length} match{matches.length !== 1 ? 'es' : ''}
          </div>
        )}
      </header>
      <main className="swipe-container">
        {isFinished ? (
          <div className="finished-card">
            <div className="finished-icon">🎉</div>
            <h2>You've seen all the pets!</h2>
            <p>You matched with {matches.length} furry friend{matches.length !== 1 ? 's' : ''}.</p>
            <button className="reset-btn" onClick={handleReset}>Start Over</button>
          </div>
        ) : (
          <>
            {pets[currentIndex + 1] && <SwipeCard pet={pets[currentIndex + 1]} isBackground />}
            <SwipeCard pet={currentPet} onSwipe={handleSwipe} swipeDirection={direction} />
          </>
        )}
      </main>
      <footer className="action-buttons">
        {!isFinished && (
          <>
            <button className="action-btn nope" onClick={() => handleSwipe('left')} aria-label="Pass"><span>👎</span></button>
            <button className="action-btn like" onClick={() => handleSwipe('right')} aria-label="Like"><span>❤️</span></button>
          </>
        )}
      </footer>
      {showMatch && <MatchModal pet={showMatch} onClose={() => setShowMatch(null)} />}
    </div>
  )
}

export default App
