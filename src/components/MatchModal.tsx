import { useEffect, useState } from 'react'
import { Pet } from '../data/pets'
import './MatchModal.css'

interface MatchModalProps { pet: Pet; onClose: () => void }

export default function MatchModal({ pet, onClose }: MatchModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 50)
    const timer = setTimeout(() => { setShow(false); setTimeout(onClose, 300) }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => { setShow(false); setTimeout(onClose, 300) }

  return (
    <div className={`match-overlay ${show ? 'show' : ''}`} onClick={handleClose}>
      <div className="match-content" onClick={e => e.stopPropagation()}>
        <div className="hearts-bg">{[...Array(12)].map((_, i) => <span key={i} className="floating-heart" style={{ '--delay': `${i * 0.15}s`, '--x': `${Math.random() * 100}%` } as React.CSSProperties}>❤️</span>)}</div>
        <h2 className="match-title">It's a Match!</h2>
        <div className="match-images">
          <div className="match-image your-pet"><span>🐾</span></div>
          <div className="match-heart">💕</div>
          <div className="match-image" style={{ backgroundImage: `url(${pet.image})` }} />
        </div>
        <p className="match-text">You and <strong>{pet.name}</strong> liked each other!</p>
        <button className="match-btn" onClick={handleClose}>Keep Swiping</button>
      </div>
    </div>
  )
}
