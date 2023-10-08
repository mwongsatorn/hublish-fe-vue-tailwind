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
    .refine((array) => array.every((element) => element.length < 20), {
      message: 'Each tag can not be more than 20 characters'
    })
})
