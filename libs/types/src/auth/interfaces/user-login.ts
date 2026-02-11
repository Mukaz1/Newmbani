import { User } from "../../users";

export interface UserLogin {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  export interface LoginResponse  {
    access_token?: string;
    refresh_token?: string;
    user?: User;
  }