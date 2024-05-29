/**
 * For GetTransactionData
 */
export class GetTransactionData {
  id: string;
  amount: number;
  transaction_name: string;
  transaction_action: string;
  transaction_thumbnail: string;
}

export class GetTransferData {
  first_name: string;
  last_name: string;
  username: string;
  verified: boolean;
  profile_picture: string;
}

/**
 * For GetTransactionResponseBody
 */
export class GetTransactionResponseBody {
  data: GetTransactionData[];
  current_page: number;
  last_page: number;
}

/**
 * For GetTransferResponseBody
 */
export class GetTransferResponseBody {
  data: GetTransferData[];
  current_page: number;
  last_page: number;
}
/**
 * For TransferRequestBody
 */
export class TransferRequestBody {
  amount: number;
  pin: string;
  send_to: string;
}
