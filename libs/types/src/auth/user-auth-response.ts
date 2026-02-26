import { Landlord } from '../landlords';
import { User } from '../users';

export interface UserAuthCheckResponse {
  user: User;
  landlord: Landlord | null;
  permissions: string[];
}
