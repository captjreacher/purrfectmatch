import { useRef, useState, useEffect } from 'react'
import { Pet } from '../data/pets'
import { getCompatibilityLabel } from '../appState'
import './SwipeCard.css'

interface SwipeCardProps {
  pet: Pet
  onSwipe?: (direction: 'left' | 'right') => void
  swipeDirection?: 'left' | 'right' | null
  isBackground?: boolean
  matchScore?: number
}

export default function SwipeCard({ pet, onSwipe, swipeDirection, isBackground, matchScore }: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState({ x: 0, y: 0, isDragging: false })
  const startPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (swipeDirection && cardRef.current) {
      const direction = swipeDirection === 'left' ? -1 : 1
      cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out'
      cardRef.current.style.transform = `translateX(${direction * 150}%) rotate(${direction * 30}deg)`
      cardRef.current.style.opacity = '0'
    }
  }, [swipeDirection])

  const handleStart = (clientX: number, clientY: number) => { if (isBackground) return; startPos.current = { x: clientX, y: clientY }; setDragState(prev => ({ ...prev, isDragging: true })) }
  const handleMove = (clientX: number, clientY: number) => { if (!dragState.isDragging || isBackground) return; setDragState(prev => ({ ...prev, x: clientX - startPos.current.x, y: clientY - startPos.current.y })) }
  const handleEnd = () => { if (!dragState.isDragging || isBackground) return; if (Math.abs(dragState.x) > 100 && onSwipe) onSwipe(dragState.x > 0 ? 'right' : 'left'); setDragState({ x: 0, y: 0, isDragging: false }) }

  const rotation = dragState.x * 0.1
  const likeOpacity = dragState.x > 0 ? Math.min(Math.abs(dragState.x) / 100, 1) : 0
  const nopeOpacity = dragState.x < 0 ? Math.min(Math.abs(dragState.x) / 100, 1) : 0

  const showScore = typeof matchScore === 'number' && !isBackground
  const compatibilityLabel = showScore ? getCompatibilityLabel(matchScore as number) : null

  return (
    <div ref={cardRef} className={`swipe-card ${isBackground ? 'background' : ''} ${dragState.isDragging ? 'dragging' : ''}`}
      style={{ transform: isBackground ? 'scale(0.95)' : `translateX(${dragState.x}px) translateY(${dragState.y}px) rotate(${rotation}deg)` }}
      onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={e => handleStart(e.clientX, e.clientY)}
      onMouseMove={e => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd} onMouseLeave={handleEnd}>
      <div className="card-image" style={{ backgroundImage: `url(${pet.image})` }}>
        {showScore && (
          <div className="score-badge">
            <strong>{matchScore}%</strong>
            <span>{compatibilityLabel}</span>
          </div>
        )}
        <div className="stamp like" style={{ opacity: likeOpacity }}>LIKE</div>
        <div className="stamp nope" style={{ opacity: nopeOpacity }}>NOPE</div>
      </div>
      <div className="card-content">
        <div className="card-header"><h2>{pet.name}</h2><span className="age">{pet.age}</span></div>
        <p className="breed">{pet.breed}</p>
        {showScore && <p className="score-copy">Compatibility based on profile vibe and pet quirks.</p>}
        <p className="bio">{pet.bio}</p>
        <div className="traits">{pet.traits.map((trait, i) => <span key={i} className="trait">{trait}</span>)}</div>
      </div>
    </div>
  )
}
