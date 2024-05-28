import { z, ZodType } from 'zod';

export class MobileValidation {
  static readonly BUYDATAMOBILE: ZodType = z.object({
    pin: z.string().regex(/^\d{6}$/, {
      message: 'The input must be exactly 6 digits.',
    }),
    data_plan_id: z.string(),
    number_phone: z.string(),
  });
}
