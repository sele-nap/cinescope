import { defineStore } from 'pinia'
import type { Movie, MovieDetails } from '~/types/movie'

interface MoviesState {
  movies: Movie[]
  currentMovie: MovieDetails | null
  isLoading: boolean
  searchQuery: string
  currentPage: number
  totalPages: number
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    currentMovie: null,
    isLoading: false,
    searchQuery: '',
    currentPage: 1,
    totalPages: 1,
  }),

  getters: {
    hasMorePages: (state): boolean => state.currentPage < state.totalPages,
    isSearching: (state): boolean => state.searchQuery.trim().length > 0,
  },

  actions: {
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
