import { defineStore } from 'pinia'
import type { Comment } from '~/types/comment'

interface CommentsState {
  comments: Record<number, Comment[]>
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    comments: {},
  }),

  getters: {
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
