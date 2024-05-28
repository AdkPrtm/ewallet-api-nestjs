/**
 * For CheckDataExistsRequestBody
 */
export class CheckDataExistsRequest {
  username: string;
  email: string;
}

/**
 * For OTPRequestBody
 */
export class OTPRequest {
  email: string;
}

/**
 * For VerificationOTPRequestBody
 */
export class VerificationOTPRequest {
  email: string;
  otp: string;
}

/**
 * For RegisterRequestBody
 */
export class RegisterRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  pin: string;
  profile_picture: string;
}

/**
 * For LoginRequestBody
 */
export class LoginRequest {
  email: string;
  password: string;
}

/**
 * For RegisterResponseBody
 */
export class AuthResponse {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  profile_picture: string;
  verified: boolean;
  balance: number;
  card_number: string;
  token: string;
}

/**
 * For CheResponseBody
 */
export class CheckDataExistsResponse {
  is_email_exists: boolean;
  is_username_exists: boolean;
}
