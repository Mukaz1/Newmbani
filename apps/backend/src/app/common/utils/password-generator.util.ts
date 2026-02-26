export const generatePassword = (payload: {
  length?: number;
  includeSpecialChars: boolean;
}): string => {
  const length = payload.length ? payload.length : 8; // Minimum length of the password
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()-_+=~[]{}|:;"<>,.?/';

  const allChars =
    lowercaseChars + uppercaseChars + numbers + payload.includeSpecialChars
      ? specialChars
      : '';

  let password = '';

  // Ensure at least one character from each set
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  if (payload.includeSpecialChars) {
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  }

  // Fill the rest of the password length
  for (let i = 0; i < length - 4; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  // Shuffle the characters in the password
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
};
