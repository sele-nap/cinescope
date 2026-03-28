import { minLength, maxLength } from '@vuelidate/validators'
import { isAlphaFr, isAlphaNumFr } from '../utils/validators'

describe('username validation (isAlphaFr)', () => {
  it('accepts letters with accents and rejects digits or special characters', () => {
    expect(isAlphaFr('Alice')).toBe(true)
    expect(isAlphaFr('Élodie')).toBe(true)
    expect(isAlphaFr('Jean-Pierre')).toBe(false) // tiret non autorisé
    expect(isAlphaFr('Alice123')).toBe(false)
    expect(isAlphaFr('Alice!')).toBe(false)
  })

  it('enforces min 3 and max 50 characters', () => {
    expect(minLength(3).$validator('Al', {} as never, {} as never)).toBe(false)
    expect(minLength(3).$validator('Ali', {} as never, {} as never)).toBe(true)
    expect(maxLength(50).$validator('A'.repeat(51), {} as never, {} as never)).toBe(false)
  })
})

describe('message validation (isAlphaNumFr)', () => {
  it('accepts French text with punctuation and rejects HTML or special characters', () => {
    expect(isAlphaNumFr('Très bon film, bravo !')).toBe(true)
    expect(isAlphaNumFr('<script>alert(1)</script>')).toBe(false)
    expect(isAlphaNumFr('Hello @ World')).toBe(false)
    expect(isAlphaNumFr('')).toBe(true) // vide géré par required
  })

  it('enforces min 3 and max 500 characters', () => {
    expect(minLength(3).$validator('ok', {} as never, {} as never)).toBe(false)
    expect(maxLength(500).$validator('a'.repeat(501), {} as never, {} as never)).toBe(false)
  })
})
