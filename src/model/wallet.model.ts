/**
 * For GetWalletResponseBody
 */
export class GetWalletResponseBody {
    balance: number;
    card_number: string;
}

/**
 * For UpdatePinWalletRequestBody
 */
export class UpdatePinWalletRequestBody {
    previous_pin: string;
    new_pin: string;
}

/**
 * For VerificationPinWalletRequestBody
 */
export class VerificationPinWalletRequestBody {
    pin: string;
}
