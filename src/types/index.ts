export type User = {
  id: string
  username: string
  name: string
  bio: string
  image: string
  email: string
  followerCount: number
  followingCount: number
  accessToken?: string | undefined
  followed?: boolean | undefined
}

export type ShortUser = Omit<User, 'accessToken' | 'email' | 'followerCount' | 'followingCount'>

export type Article = {
  id: string
  title: string
  slug: string
  content: string
  tags: string[]
  favouriteCount: number
  createdAt: string
  updatedAt: string
  author_id: string
  author: {
    username: string
    name: string
    bio: string
    image: string
  }
  favourited: boolean
}

export type Comment = {
  id: string
  createdAt: string
  updatedAt: string
  body: string
  commentAuthor_id: string
  commentAuthor: {
    id: string
    username: string
    name: string
    bio: string
    image: string
  }
}

export interface PageResult<T> {
  total_results: number
  results: T[]
  page: number
  total_pages: number
}
