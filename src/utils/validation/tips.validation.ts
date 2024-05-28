import { z, ZodType } from 'zod';

export class TipsValidation {
  static readonly QUERY: ZodType = z.object({
    limit: z.number(),
    page: z.number(),
  });
}
