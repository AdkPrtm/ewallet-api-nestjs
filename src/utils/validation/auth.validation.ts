import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly CHECKDATAEXISTS: ZodType = z.object({
    email: z
      .string()
      .min(3)
      .max(100)
      .email({ message: 'Invalid email address' }),
    username: z
      .string()
      .min(3, { message: 'Min username 3 characters' })
      .max(50, { message: 'Max username 50 characters' }),
  });

  static readonly REGISTER: ZodType = z.object({
    first_name: z
      .string()
      .min(3, { message: 'Min First Name 3 characters' })
      .max(50, { message: 'Max First Name 50 characters' }),
    last_name: z
      .string()
      .min(1, { message: 'Min Last Name 1 characters' })
      .max(50, { message: 'Max Last Name 50 characters' }),
    username: z
      .string()
      .min(3, { message: 'Min username 3 characters' })
      .max(50, { message: 'Max username 50 characters' }),
    email: z
      .string()
      .min(3)
      .max(100)
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        {
          message:
            'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.',
        },
      ),
    pin: z.string().regex(/^\d{6}$/, {
      message: 'The input must be exactly 6 digits.',
    }),
    profile_picture: z.string().optional(),
    token_device: z.string(),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z
      .string()
      .min(3)
      .max(100)
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        {
          message:
            'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.',
        },
      ),
    token_device: z.string(),
  });
}
