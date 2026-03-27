import type { Movie, MovieDetails, MovieCredits, TmdbResponse } from '~/types/movie'

/** Wrapper autour de l'API TMDB — tous les appels passent par le proxy serveur /api/tmdb. */
export function useTmdb() {
  const config = useRuntimeConfig()
  const { locale } = useNuxtApp().$i18n

  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
  }

  function getLanguage(): string {
    const code = locale.value as string
    return localeMap[code] ?? code
  }

  /** Appel générique vers le proxy TMDB avec injection automatique de la langue courante. */
  async function fetchTmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    return $fetch<T>(`/api/tmdb/${path}`, {
      params: { language: getLanguage(), ...params },
    })
  }

  /**
   * Construit l'URL d'une image TMDB.
   * @returns null si path est absent (poster/backdrop optionnel).
   */
  function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
    if (!path) return null
    return `${config.public.tmdbImageBaseUrl}/${size}${path}`
  }

  function fetchPopular(page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>('movie/popular', { page })
  }

  function fetchTrending(timeWindow: 'day' | 'week' = 'week', page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>(`trending/movie/${timeWindow}`, { page })
  }

  function searchMovies(query: string, page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>('search/movie', { query, page })
  }

  function fetchMovieDetails(id: number) {
    return fetchTmdb<MovieDetails>(`movie/${id}`)
  }

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
