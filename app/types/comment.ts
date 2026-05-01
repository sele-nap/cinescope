export interface Comment {
  id: string
  movieId: number
  username: string
  message: string
  rating: number
  createdAt: string
}

export interface CommentFormData {
  username: string
  message: string
  rating: number
}
