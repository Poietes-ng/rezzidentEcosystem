export interface User {
  id: string;
  email: string;
  role: "estate_admin" | "resident" | "staff" | "platform_admin";
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
