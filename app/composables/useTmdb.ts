import type { Movie, MovieDetails, MovieCredits, TmdbResponse } from '~/types/movie'

/**
 * Wrapper autour de l'API TMDB.
 * Tous les appels passent par le proxy serveur `/api/tmdb` pour ne pas exposer la clé API côté client.
 * La langue est injectée automatiquement à chaque requête selon la locale i18n active.
 */
export function useTmdb() {
  const config = useRuntimeConfig()
  const { locale } = useNuxtApp().$i18n

  // Mapping code i18n → paramètre language attendu par TMDB
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
  }

  function getLanguage(): string {
    const code = locale.value as string
    return localeMap[code] ?? code
  }

  /**
   * Appel générique vers le proxy TMDB.
   * Injecte la langue courante dans chaque requête — réactif au changement de locale.
   */
  async function fetchTmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    return $fetch<T>(`/api/tmdb/${path}`, {
      params: { language: getLanguage(), ...params },
    })
  }

  /**
   * Construit l'URL complète d'une image hébergée sur image.tmdb.org.
   * @param path - Chemin retourné par TMDB (ex: `/abc123.jpg`), peut être null.
   * @param size - Taille souhaitée parmi les formats disponibles TMDB.
   * @returns null si le chemin est absent (poster ou backdrop non renseigné).
   */
  function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
    if (!path) return null
    return `${config.public.tmdbImageBaseUrl}/${size}${path}`
  }

  function fetchPopular(page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>('movie/popular', { page })
  }

  /** @param timeWindow - `day` pour les tendances du jour, `week` pour la semaine. */
  function fetchTrending(timeWindow: 'day' | 'week' = 'week', page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>(`trending/movie/${timeWindow}`, { page })
  }

  function searchMovies(query: string, page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>('search/movie', { query, page })
  }

  /** Retourne les détails complets d'un film : genres, runtime, tagline, etc. */
  function fetchMovieDetails(id: number) {
    return fetchTmdb<MovieDetails>(`movie/${id}`)
  }

  /** Retourne le casting (cast) et l'équipe technique (crew) d'un film. */
  function fetchMovieCredits(id: number) {
    return fetchTmdb<MovieCredits>(`movie/${id}/credits`)
  }

  return {
    getImageUrl,
    fetchPopular,
    fetchTrending,
    searchMovies,
    fetchMovieDetails,
    fetchMovieCredits,
  }
}
