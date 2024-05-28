import { z, ZodType } from 'zod';

const trxType = ['topup'] as const;
const paymentCode = [
  'BCA',
  'BNI',
  'ID_DANA',
  'ID_SHOPEEPAY',
  'ID_LINKAJA',
] as const;

export class TopupValidation {
  static readonly MAKETOPUP: ZodType = z.object({
    transaction_type: z.enum(trxType),
    payment_code: z.enum(paymentCode),
    amount: z.number().min(10000).max(99000000),
    pin: z.string().regex(/^\d{6}$/, {
      message: 'The input must be exactly 6 digits.',
    }),
  });
}
