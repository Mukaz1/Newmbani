export interface AuditLog {
  ip: string;
  userId: string;
  userAgent: string;
  email: string;
  method: string;
  url: string;
  createdAt: Date;
}
