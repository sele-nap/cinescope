import type { Movie, MovieDetails, MovieCredits, TmdbResponse } from '~/types/movie'

export function useTmdb() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.tmdbBaseUrl

  async function fetchTmdb<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const query = new URLSearchParams({
      language: 'fr-FR',
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    })

    const data = await $fetch<T>(`${baseUrl}${endpoint}?${query}`, {
      headers: {
        Authorization: `Bearer ${useRuntimeConfig().tmdbApiKey}`,
        Accept: 'application/json',
      },
    })

    return data
  }

  function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
    if (!path) return null
    return `${config.public.tmdbImageBaseUrl}/${size}${path}`
  }

  function fetchPopular(page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>('/movie/popular', { page })
  }

  function fetchTrending(timeWindow: 'day' | 'week' = 'week') {
    return fetchTmdb<TmdbResponse<Movie>>(`/trending/movie/${timeWindow}`)
  }

  function searchMovies(query: string, page = 1) {
    return fetchTmdb<TmdbResponse<Movie>>('/search/movie', { query, page })
  }

  function fetchMovieDetails(id: number) {
    return fetchTmdb<MovieDetails>(`/movie/${id}`)
  }

  function fetchMovieCredits(id: number) {
    return fetchTmdb<MovieCredits>(`/movie/${id}/credits`)
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
