/**
 * Adds leading zeros to a number to reach a certain number of digits.
 *
 * @param number - The number to pad with leading zeros.
 * @param digits - The desired number of digits for the output string.
 */
export function addLeadingZeros(number: number, digits: number) {
  return (
    Array(Math.max(digits - String(number).toString().length + 1, 0)).join(
      '0'
    ) + number
  );
}
