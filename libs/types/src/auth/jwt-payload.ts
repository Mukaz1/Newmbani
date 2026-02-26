
export interface JwtPayload {
  sub: string;
  name: string;
  phone: string;
  isBackOfficeUser: boolean;
  email: string;
}
