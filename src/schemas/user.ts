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

export type User = z.infer<typeof UserSchema>
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  name: z.string(),
  bio: z.string(),
  image: z.string(),
  accessToken: z.string().optional(),
  followerCount: z.number(),
  followingCount: z.number()
})

export type ChangeEmail = z.infer<typeof ChangeEmailSchema>
export const ChangeEmailSchema = z.object({
  password: z.string().nonempty({ message: 'This field can not be empty' }),
  newEmail: z.string().email({ message: 'This is an invalid email' })
})

export type ChangePassword = z.infer<typeof ChangePasswordSchema>
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty({ message: 'This field can not be empty' }),
    newPassword: z.string().nonempty({ message: 'This field can not be empty' }),
    confirmPassword: z.string().nonempty({ message: 'This field can not be empty' })
  })
  .refine((schema) => schema.confirmPassword === schema.newPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
  })

export type ChangeProfile = z.infer<typeof ChangeProfileSchema>
export const ChangeProfileSchema = z.object({
  name: z
    .string()
    .max(70, {
      message: 'Your name can not be more than 70 characters.'
    })
    .nonempty({ message: 'This field can not be empty' }),
  bio: z.string().max(160, {
    message: 'Your bio can not be more than 160 characters.'
  })
})
