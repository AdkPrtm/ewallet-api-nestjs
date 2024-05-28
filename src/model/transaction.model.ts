/**
 * For GetTransactionResponseBody
 */
export class GetTransactionResponseBody {
  id: string;
  amount: number;
  transaction_name: string;
  transaction_action: string;
  transaction_thumbnail: string;
}

/**
 * For TransferRequestBody
 */
export class TransferRequestBody {
  amount: number;
  pin: string;
  send_to: string;
}
