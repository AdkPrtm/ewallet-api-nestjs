import { z, ZodType } from 'zod';

export class TransactionValidation {
  static readonly TRANSFER: ZodType = z.object({
    pin: z.string().regex(/^\d{6}$/, {
      message: 'The input must be exactly 6 digits.',
    }),
    amount: z.number().min(10000).max(99000000),
    send_to: z.string().min(3, { message: 'Username minimum 3 characters' }),
  });
}
