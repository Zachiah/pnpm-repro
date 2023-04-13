export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};
export type AuthResponseSuccess = {
  access_token: string;
  refresh_token: string;
  user: User;
};

type UserField =
  | "email"
  | "password"
  | "first_name"
  | "last_name"
  | "confirm_password";

export type RegisterResponseError = {
  status: number;
  errors: Record<UserField, string[]>;
};

export type ApiError = { message: string };

export type OAuthResponse = {
  data: {
    session_params: {
      state: string;
    };
    url: string;
  };
};

export type ApiResponse = {
  ok: boolean;
  status: number;
  statusText?: string;
  data: any;
};

export type ErrorResponse<T> = {
  status: number;
  statusText?: string;
  data?: T;
  reason?: string;
};
