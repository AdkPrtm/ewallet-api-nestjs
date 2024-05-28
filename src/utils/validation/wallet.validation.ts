import { z, ZodType } from 'zod';

export class WalletValidation {
  static readonly UPDATEWALLET: ZodType = z.object({
    previous_pin: z.string().regex(/^\d{6}$/, {
      message: 'The input previous pin must be exactly 6 digits.',
    }),
    new_pin: z.string().regex(/^\d{6}$/, {
      message: 'The input new pin must be exactly 6 digits.',
    }),
  });

  static readonly VERIFPINWALLET: ZodType = z.object({
    pin: z.string().regex(/^\d{6}$/, {
      message: 'The input previous pin must be exactly 6 digits.',
    }),
  });
}
