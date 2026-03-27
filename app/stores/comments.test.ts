import { setActivePinia, createPinia } from 'pinia'
import { useCommentsStore } from './comments'
import type { Comment } from '../types/comment'

const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: crypto.randomUUID(),
  movieId: 1,
  username: 'Alice',
  message: 'Great movie!',
  rating: 8,
  createdAt: new Date().toISOString(),
  ...overrides,
})

describe('useCommentsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('returns comments in newest-first order', () => {
    const store = useCommentsStore()

    store.addComment(1, makeComment({ id: '1', username: 'First', createdAt: '2024-01-01T00:00:00Z' }))
    store.addComment(1, makeComment({ id: '2', username: 'Second', createdAt: '2024-12-01T00:00:00Z' }))

    const comments = store.getCommentsByMovieId(1)
    expect(comments[0].username).toBe('Second')
    expect(comments[1].username).toBe('First')
  })

  it('persists comments to localStorage on add', () => {
    const store = useCommentsStore()
    store.addComment(10, makeComment({ movieId: 10 }))

    const stored = JSON.parse(localStorage.getItem('cinescope_comments')!)
    expect(stored[10]).toHaveLength(1)
  })
})
