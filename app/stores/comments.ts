import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Comment } from '~/types/comment'

export const useCommentsStore = defineStore('comments', () => {
  const comments = useLocalStorage<Record<number, Comment[]>>('cinescope_comments', {})

  function addComment(movieId: number, comment: Comment): void {
    if (!comments.value[movieId]) {
      comments.value[movieId] = []
    }
    comments.value[movieId].push(comment)
  }

  function getCommentsByMovieId(movieId: number): Comment[] {
    return (comments.value[movieId] ?? []).slice().reverse()
  }

  return { comments, addComment, getCommentsByMovieId }
})
