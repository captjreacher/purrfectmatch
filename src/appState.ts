import { pets, Pet } from './data/pets'

export type SwipeDecision = 'like' | 'pass'

export type PetProfile = {
  petName: string
  species: 'Dog' | 'Cat' | 'Any'
  vibe: string
  lookingFor: string
}

export type SwipeRecord = {
  petId: number
  decision: SwipeDecision
  matched: boolean
}

export const defaultProfile: PetProfile = {
  petName: 'Your pet',
  species: 'Any',
  vibe: 'Chaotic good, snack-led, emotionally available',
  lookingFor: 'Walks, couch time, play dates and questionable decisions',
}

export function getMatchScore(pet: Pet, profile: PetProfile): number {
  const traitText = `${pet.breed} ${pet.bio} ${pet.traits.join(' ')}`.toLowerCase()
  let score = 48

  if (profile.species !== 'Any' && traitText.includes(profile.species.toLowerCase())) score += 10
  if (traitText.includes('cuddly') || traitText.includes('snuggly') || traitText.includes('loyal')) score += 12
  if (traitText.includes('playful') || traitText.includes('energetic')) score += 8
  if (traitText.includes('mysterious') || traitText.includes('dramatic') || traitText.includes('sassy')) score += 6

  const profileSignal = `${profile.vibe} ${profile.lookingFor}`.toLowerCase()
  if (profileSignal.includes('chaos') && traitText.includes('chaos')) score += 10
  if (profileSignal.includes('couch') && traitText.includes('couch')) score += 10
  if (profileSignal.includes('walk') && (traitText.includes('walk') || traitText.includes('energetic'))) score += 8

  return Math.max(35, Math.min(96, score))
}

export function isDeterministicMatch(pet: Pet, profile: PetProfile): boolean {
  return getMatchScore(pet, profile) >= 68
}

export function getNextPet(index: number): Pet | undefined {
  return pets[index]
}
