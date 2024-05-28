import { Tip } from '@prisma/client';

/**
 * For GetQueryParamRequestQuery
 */
export class GetQueryParamRequestQuery {
  limit: number;
  page: number;
}

/**
 * For GetTipsResponseBody
 */
export class GetTipsResponseBody {
  data: Tip[];
  current_page: number;
  last_page: number;
}
