import { defineStore } from 'pinia'
import type { Comment } from '~/types/comment'

interface CommentsState {
  /** Commentaires indexés par movieId pour un accès O(1). */
  comments: Record<number, Comment[]>
}

/**
 * Store Pinia pour les commentaires utilisateurs.
 * Les données sont persistées dans le localStorage sous la clé `cinescope_comments`.
 */
export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    comments: {},
  }),

  getters: {
    /**
     * Retourne les commentaires d'un film triés du plus récent au plus ancien.
     * On retourne une copie (slice) pour ne pas muter l'état en inversant.
     */
    getCommentsByMovieId:
      (state) =>
      (movieId: number): Comment[] => {
        return (state.comments[movieId] ?? []).slice().reverse()
      },
  },

  actions: {
    /** Ajoute un commentaire et synchronise immédiatement le localStorage. */
    addComment(movieId: number, comment: Comment): void {
      if (!this.comments[movieId]) {
        this.comments[movieId] = []
      }
      this.comments[movieId].push(comment)
      this.persistToStorage()
    },

    /**
     * Hydrate le store depuis le localStorage.
     * À appeler dans `onMounted` pour éviter les erreurs SSR.
     */
    loadFromStorage(): void {
      const stored = localStorage.getItem('cinescope_comments')
      if (!stored) return
      try {
        this.comments = JSON.parse(stored)
      }
      catch {
        localStorage.removeItem('cinescope_comments')
      }
    },

    persistToStorage(): void {
      localStorage.setItem('cinescope_comments', JSON.stringify(this.comments))
    },
  },
})
