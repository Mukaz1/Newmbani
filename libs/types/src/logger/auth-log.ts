export interface AuthLog {
  ip: string;
  userId?: string;
  userAgent: string;
  email: string;
  loginSuccess: boolean;
  createdAt: Date;
}
