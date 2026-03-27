import { alpha, minLength, maxLength } from '@vuelidate/validators'

const isAlpha = (v: string) => alpha.$validator(v, {} as never, {} as never)

const alphaNumFr = (value: string): boolean => {
  if (value.trim() === '') return true
  return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?()\-'"]+$/.test(value)
}

describe('username validation', () => {
  it('accepts letters only and rejects alphanumeric or special characters', () => {
    expect(isAlpha('Alice')).toBe(true)
    expect(isAlpha('Alice123')).toBe(false)
    expect(isAlpha('Alice!')).toBe(false)
  })

  it('enforces min 3 and max 50 characters', () => {
    expect(minLength(3).$validator('Al', {} as never, {} as never)).toBe(false)
    expect(minLength(3).$validator('Ali', {} as never, {} as never)).toBe(true)
    expect(maxLength(50).$validator('A'.repeat(51), {} as never, {} as never)).toBe(false)
  })
})

describe('message validation (alphaNumFr)', () => {
  it('accepts French text with punctuation and rejects HTML or special characters', () => {
    expect(alphaNumFr('Très bon film, bravo !')).toBe(true)
    expect(alphaNumFr('<script>alert(1)</script>')).toBe(false)
    expect(alphaNumFr('Hello @ World')).toBe(false)
  })

  it('enforces min 3 and max 500 characters', () => {
    expect(minLength(3).$validator('ok', {} as never, {} as never)).toBe(false)
    expect(maxLength(500).$validator('a'.repeat(501), {} as never, {} as never)).toBe(false)
  })
})
