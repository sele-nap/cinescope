import { defineStore } from 'pinia'
import type { Comment } from '~/types/comment'

interface CommentsState {
  /** Commentaires indexés par movieId. */
  comments: Record<number, Comment[]>
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    comments: {},
  }),

  getters: {
    /** Retourne les commentaires d'un film, du plus récent au plus ancien. */
    getCommentsByMovieId:
      (state) =>
      (movieId: number): Comment[] => {
        return (state.comments[movieId] ?? []).slice().reverse()
      },
  },

  actions: {
    addComment(movieId: number, comment: Comment): void {
      if (!this.comments[movieId]) {
        this.comments[movieId] = []
      }
      this.comments[movieId].push(comment)
      this.persistToStorage()
    },

    /** Hydrate le store depuis le localStorage (à appeler dans onMounted). */
    loadFromStorage(): void {
      const stored = localStorage.getItem('cinescope_comments')
      if (stored) {
        this.comments = JSON.parse(stored)
      }
    },

    persistToStorage(): void {
      localStorage.setItem('cinescope_comments', JSON.stringify(this.comments))
    },
  },
})
