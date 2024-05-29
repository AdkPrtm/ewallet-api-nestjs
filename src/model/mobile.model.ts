import { DataPlan, OperatorCard, StatusEnum } from '@prisma/client';

class DataPlanClass implements DataPlan {
  id: string;
  name: string;
  price: number;
  operatorCardId: string;
  createdAt: Date;
  updatedAt: Date;
}

class OperatorCardClass implements OperatorCard {
  id: string;
  name: string;
  status: StatusEnum;
  thumbnail: string;
  DataPlan: DataPlanClass[];
  createdAt: Date;
  updatedAt: Date;
}

export class GetDataPlanResponseBody {
  data: OperatorCard[];
  current_page: number;
  last_page: number;
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
