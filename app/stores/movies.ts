import { defineStore } from 'pinia'
import type { Movie } from '~/types/movie'

interface MoviesState {
  movies: Movie[]
  searchQuery: string
  currentPage: number
  totalPages: number
}

/**
 * Store Pinia pour la liste des films et la pagination.
 * La logique de fetch reste dans les pages — ce store gère uniquement l'état partagé.
 */
export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    searchQuery: '',
    currentPage: 1,
    totalPages: 1,
  }),

  getters: {
    /** Vrai tant qu'il reste des pages à charger (utilisé par l'infinite scroll). */
    hasMorePages: (state): boolean => state.currentPage < state.totalPages,
    isSearching: (state): boolean => state.searchQuery.trim().length > 0,
  },

  actions: {
    /** Met à jour la recherche et remet la liste à zéro pour repartir de la page 1. */
    setSearchQuery(query: string): void {
      this.searchQuery = query
      this.movies = []
      this.currentPage = 1
    },

    resetMovies(): void {
      this.movies = []
      this.currentPage = 1
      this.totalPages = 1
    },
  },
})
