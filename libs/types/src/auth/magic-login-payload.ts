export interface MagicLoginPayload {
  destination: string;
  code: string;
  iat: number;
  exp: number;
}
