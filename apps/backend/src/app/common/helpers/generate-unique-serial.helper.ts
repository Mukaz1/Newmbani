import { generatePassword } from '../utils/password-generator.util';

export function generateUniqueSerial(): string {
  const date = new Date();

  // generate serial
  const serial: string =
    generatePassword({
      length: 4,
      includeSpecialChars: false,
    }).toUpperCase() + Number(date).toString(36).toUpperCase();

  return serial;
}
