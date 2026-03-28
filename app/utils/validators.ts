/** Lettres uniquement, accents inclus (é, è, à, É…). Rejette les chiffres et caractères spéciaux. */
export function isAlphaFr(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(value)
}

/** Lettres, chiffres et ponctuation courante. Vide accepté (géré par le validateur required). */
export function isAlphaNumFr(value: unknown): boolean {
  if (typeof value !== 'string' || value.trim() === '') return true
  return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?()\-'"]+$/.test(value)
}
