export interface AdminAuthUser {
  name: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}