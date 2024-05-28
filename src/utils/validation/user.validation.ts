import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly GETDATAUSERBYUSERNAME: ZodType = z.object({
    username: z
      .string()
      .min(3, { message: 'Min username 3 characters' })
      .max(50, { message: 'Max username 50 characters' }),
  });

  static readonly UPDATEUSER: ZodType = z.object({
    first_name: z
      .string()
      .min(3, { message: 'Min First Name 3 characters' })
      .max(50, { message: 'Max First Name 50 characters' })
      .optional(),
    last_name: z
      .string()
      .min(1, { message: 'Min Last Name 1 characters' })
      .max(50, { message: 'Max Last Name 50 characters' })
      .optional(),
    username: z
      .string()
      .min(3, { message: 'Min username 3 characters' })
      .max(50, { message: 'Max username 50 characters' })
      .optional(),
    email: z
      .string()
      .min(3)
      .max(100)
      .email({ message: 'Invalid email address' })
      .optional(),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        {
          message:
            'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.',
        },
      )
      .optional(),
    profile_picture: z.string().optional(),
  });
}
