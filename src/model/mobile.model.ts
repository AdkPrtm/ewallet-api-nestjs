import { StatusEnum } from '@prisma/client';

class DataPlanClass {
  id: string;
  name: string;
  price: number;
  operator_card_id: string;
}

export class OperatorCardClass {
  id: string;
  name: string;
  status: StatusEnum;
  thumbnail: string;
  data_plans: DataPlanClass[];
}

/**
 * For GetOperatorResponseBody
 */
export class GetOperatorResponseBody {
  data: OperatorCardClass[];
  current_page: number;
  last_page: number;
}

/**
 * For BuyDataMobileRequestBody
 */
export class BuyDataMobileRequestBody {
  pin: string;
  data_plan_id: string;
  number_phone: string;
}
