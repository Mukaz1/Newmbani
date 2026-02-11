export interface AuditData {
    _id: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    deletedBy?: string;
    deletedAt?: Date;
  }