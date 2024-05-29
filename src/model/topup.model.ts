/**
 * For TopupRequestBody
 */
export class TopupRequestBody {
  payment_code: string;
  transaction_type: string;
  amount: number;
  pin: string;
}

/**
 * For TopupVAResponseBody
 */
export class TopupVAResponseBody {
  external_id: string;
  payment_name: string;
  account_number: string;
  amount: number;
  expiration_date: Date;
}

/**
 * For TopupVAResponseBody
 */
export class TopupEwalletResponseBody {
  reference_id: string;
  charge_amount: number;
  link_payment: string;
}
