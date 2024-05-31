/**
 * For GetUserResponseBody
 */
export class GetUserResponseBodyResponse {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  verified: boolean;
  profile_picture: string;
  balance: number;
  card_number: string;
}

/**
 * For GetUserByUsernameResponseBody
 */
export class GetUserByUsernameBodyResponse {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  verified: boolean;
  profile_picture: string;
}

/**
 * For UpdateUserRequestBody
 */
export class UpdateUserRequestBody {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}
