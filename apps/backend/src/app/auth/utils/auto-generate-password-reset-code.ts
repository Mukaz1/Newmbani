import { randomBytes } from 'crypto';
import { generateUniqueBatchNumber } from '../../common/helpers';

export const generatePasswordResetCode = (userId?: string) => {
  const prefix: string = generateUniqueBatchNumber();
  return `${prefix}${userId}${generateUniqueBatchNumber()}`;
};

export function generateResetCode(length = 32): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

