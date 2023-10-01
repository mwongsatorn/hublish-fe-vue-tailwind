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

export type LogIn = z.infer<typeof LogInSchema>
export const LogInSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }),
  password: z.string().nonempty({ message: 'Password is required' })
})

export const LogInResponseSchema = z.object({
  user: z.object({
    accessToken: z.string(),
    email: z.string(),
    username: z.string(),
    name: z.string(),
    bio: z.string()
  })
})

export const ProfileSchema = z.object({
  profile: z.object({
    username: z.string(),
    name: z.string(),
    email: z.string(),
    bio: z.string()
  })
})
