import { pets, Pet } from './data/pets'

export type SwipeDecision = 'like' | 'pass'
export type SpeciesVoice = 'woof' | 'meow' | 'sniff'

export type PetProfile = {
  petName: string
  species: 'Dog' | 'Cat' | 'Any'
  vibe: string
  lookingFor: string
  foodWhenDead: string
  foodToChase: string
  fashionStyle: string
  sleepingSpot: string
  ownerNotes: string
  datingRedFlags: string
  speciesVoice: SpeciesVoice
}

export type SwipeRecord = {
  petId: number
  decision: SwipeDecision
  matched: boolean
}

export type PetMessage = {
  id: string
  petId: number
  from: 'you' | 'them'
  text: string
  translated?: string
  paidTranslation?: boolean
}

export const defaultProfile: PetProfile = {
  petName: 'Your pet',
  species: 'Any',
  vibe: 'Chaotic good, snack-led, emotionally available',
  lookingFor: 'Walks, couch time, play dates and questionable decisions',
  foodWhenDead: '',
  foodToChase: '',
  fashionStyle: '',
  sleepingSpot: '',
  ownerNotes: '',
  datingRedFlags: '',
  speciesVoice: 'sniff',
}

export const demoProfile: PetProfile = {
  petName: 'Biscuit',
  species: 'Dog',
  vibe: 'Chaos-led, snack-motivated, professional sock thief',
  lookingFor: 'Long sniffs, shared snacks, somebody who tolerates the zoomies',
  foodWhenDead: 'Anything that fell off a BBQ, sausages, suspicious meat',
  foodToChase: 'The postie, suspicious shadows, that one bird, flies',
  fashionStyle: 'Bandana acceptable, jumpers tolerated for two photos only',
  sleepingSpot: 'Human bed, centre position, pillow as personal asset',
  ownerNotes: 'Owner has thumbs and decent treat etiquette but cries during movies',
  datingRedFlags: 'Vacuum enthusiasm, bath positivity, sharing toys too easily',
  speciesVoice: 'woof',
}

export function defaultVoiceForSpecies(species: PetProfile['species']): SpeciesVoice {
  if (species === 'Dog') return 'woof'
  if (species === 'Cat') return 'meow'
  return 'sniff'
}

export function mergeProfile(saved: Partial<PetProfile> | undefined): PetProfile {
  const base = { ...defaultProfile, ...(saved || {}) }
  // Coerce voice to known value if old session stored something else
  if (base.speciesVoice !== 'woof' && base.speciesVoice !== 'meow' && base.speciesVoice !== 'sniff') {
    base.speciesVoice = defaultVoiceForSpecies(base.species)
  }
  return base
}

export function getMatchScore(pet: Pet, profile: PetProfile): number {
  const traitText = `${pet.breed} ${pet.bio} ${pet.traits.join(' ')}`.toLowerCase()
  const profileSignal = `${profile.vibe} ${profile.lookingFor} ${profile.foodWhenDead} ${profile.foodToChase} ${profile.fashionStyle} ${profile.sleepingSpot} ${profile.ownerNotes} ${profile.datingRedFlags}`.toLowerCase()
  let score = 48

  // Species filter alignment
  if (profile.species !== 'Any' && traitText.includes(profile.species.toLowerCase())) score += 10

  // Trait flavour boosts
  if (traitText.includes('cuddly') || traitText.includes('snuggly') || traitText.includes('loyal')) score += 10
  if (traitText.includes('playful') || traitText.includes('energetic')) score += 6
  if (traitText.includes('mysterious') || traitText.includes('dramatic') || traitText.includes('sassy')) score += 4

  // Couch / bed / nap pets pair well with snuggly / lazy targets
  if (
    (profileSignal.includes('couch') || profileSignal.includes('bed') || profileSignal.includes('sunny patch') || profileSignal.includes('nap') || profileSignal.includes('laundry basket')) &&
    (traitText.includes('lazy') || traitText.includes('snuggly') || traitText.includes('nap'))
  ) {
    score += 10
  }

  // Chaos / chase pairs with energetic / mischievous
  if (
    (profileSignal.includes('chaos') || profileSignal.includes('zoomies') || profileSignal.includes('chase')) &&
    (traitText.includes('chaos') || traitText.includes('energetic') || traitText.includes('playful'))
  ) {
    score += 8
  }

  // Walks / outdoors
  if (profileSignal.includes('walk') && (traitText.includes('walk') || traitText.includes('energetic'))) score += 6

  // Specific chase signals -> energetic / mischievous boost
  const chaseSignals = ['bird', 'fly', 'flies', 'sock', 'postie', 'shadow', 'squirrel', 'mouse', 'leaf']
  if (
    chaseSignals.some(s => profileSignal.includes(s)) &&
    (traitText.includes('playful') || traitText.includes('energetic') || traitText.includes('genius') || traitText.includes('stubborn') || traitText.includes('attention'))
  ) {
    score += 6
  }

  // Fashion mismatch — naked-and-proud vs regal/high-maintenance pets
  if (profileSignal.includes('naked') && (traitText.includes('regal') || traitText.includes('high maintenance') || traitText.includes('royalty'))) {
    score -= 4
  }

  // Owner judging -> matches dramatic / sassy / judgmental targets
  if ((profileSignal.includes('staff') || profileSignal.includes('judg') || profileSignal.includes('thumbs')) && (traitText.includes('judgmental') || traitText.includes('regal') || traitText.includes('sassy'))) {
    score += 4
  }

  // Voice / species cohort small alignment bonus
  if (profile.speciesVoice === 'woof' && (traitText.includes('retriever') || traitText.includes('labrador') || traitText.includes('collie') || traitText.includes('bulldog') || traitText.includes('shiba') || traitText.includes('corgi'))) score += 4
  if (profile.speciesVoice === 'meow' && (traitText.includes('cat') || traitText.includes('persian') || traitText.includes('siamese') || traitText.includes('tabby'))) score += 4

  return Math.max(35, Math.min(96, score))
}

export function getCompatibilityLabel(score: number): string {
  if (score >= 80) return 'Strong sniff'
  if (score >= 68) return 'Worth a sniff'
  if (score >= 55) return 'Questionable chemistry'
  return 'Polite tail wag'
}

export function isDeterministicMatch(pet: Pet, profile: PetProfile): boolean {
  return getMatchScore(pet, profile) >= 68
}

export function getNextPet(index: number): Pet | undefined {
  return pets[index]
}
