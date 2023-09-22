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

const SignUpSuccess = z.object({
  status: z.literal(true),
  message: z.string()
})
const SignUpError = z.object({
  status: z.literal(false),
  error: z.string()
})

export const SignUpResponseSchema = z.discriminatedUnion('status', [SignUpSuccess, SignUpError])

export type LogIn = z.infer<typeof LogInSchema>
export const LogInSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }),
  password: z.string().nonempty({ message: 'Password is required' })
})

const LoginSuccess = z.object({
  status: z.literal(true),
  accessToken: z.string()
})
const LoginError = z.object({
  status: z.literal(false),
  error: z.string()
})

export const LogInResponseSchema = z.discriminatedUnion('status', [LoginSuccess, LoginError])
