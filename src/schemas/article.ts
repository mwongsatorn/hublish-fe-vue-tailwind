import { z } from 'zod'

export type CreateArticle = z.infer<typeof CreateArticleSchema>
export const CreateArticleSchema = z.object({
  title: z.string().max(70, {
    message: 'Your title can not be more than 70 characters'
  }),
  content: z.string().max(1500, {
    message: 'Your content can not be more than 1,500 characters'
  }),
  tags: z
    .string()
    .array()
    .optional()
    .refine(
      (array) => {
        if (Array.isArray(array)) {
          return array.every((element) => element.length < 20)
        } else return true
      },
      {
        message: 'Each tag can not be more than 20 characters'
      }
    )
})

export type EditArticle = z.infer<typeof EditArticleSchema>
export const EditArticleSchema = CreateArticleSchema.partial()

export type Article = z.infer<typeof ArticleSchema>
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  tags: z.string().array(),
  favouriteCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author_id: z.string(),
  author: z.object({
    username: z.string(),
    name: z.string(),
    bio: z.string(),
    image: z.string()
  }),
  favourited: z.boolean()
})

export type Comment = z.infer<typeof CommentSchema>
export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  commentAuthor_id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  commentAuthor: z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    image: z.string(),
    bio: z.string()
  })
})

export type AddComment = z.infer<typeof AddCommentSchema>
export const AddCommentSchema = z.string().max(300, {
  message: 'Your comment can not be more than 300 characters'
})
