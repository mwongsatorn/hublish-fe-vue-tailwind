import { z } from 'zod'

export type SignUp = z.infer<typeof SignUpSchema>

export const SignUpSchema = z
  .object({
    username: z
      .string({ required_error: 'Username is required' })
      .nonempty({ message: 'Username can not be empty' })
      .min(8, { message: 'Username must be at least 8 characters' }),
    password: z
      .string({ required_error: 'Password is required' })
      .nonempty({ message: 'Password can not be empty' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string({ required_error: 'Field is required' }),
    email: z
      .string()
      .nonempty({ message: 'Email can not be empty' })
      .email({ message: 'This is an invalid email' })
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type UserResponse = z.infer<typeof UserResponseSchema>
export const UserResponseSchema = z.object({
  status: z.number(),
  message: z.string()
})
