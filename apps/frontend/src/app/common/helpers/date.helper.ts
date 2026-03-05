
export interface Period {
  inceptionDate: string;
  expiryDate: string;
  days: number;
}
/**
 * Extracts the date portion from a Date object.
 *
 * @param date - The Date object to extract the date from.
 * @returns The date portion in ISO format without the time.
 */
export function ExtractHTMLInputDate(date: Date | string) {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toISOString().split('T')[0];
}

/**
 * Check if leap year
 *
 * @param {number} year
 * @return {*}
 */
export function checkIfLeapYear(year: number) {
  return (year % 4 === 0 && year % 100!== 0) || year % 400 === 0;
}

/**
 *Get diference in days
 *
 * @export
 * @param {Date} a
 * @param {Date} b
 * @return {*}
 */
export function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
/**
 * Add Days including the end date to the range
 *
 * @param {Date} date
 * @param {number} days
 * @return {*}  {Date}
 */
export function addDays(date: Date, days: number): Date {
  // const isLeapYear: boolean = checkIfLeapYear(date.getFullYear());
  const daysToAdd = days - 1;
  const result = new Date(date);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

/**
 * Subtract Days including the end date to the range
 *
 * @param {Date} date
 * @param {number} days
 * @return {*}  {Date}
 */
export function subtractDays(date: Date, days: number): Date {
  const daysToAdd = days - 1;
  const result = new Date(date);
  result.setDate(result.getDate() - daysToAdd);
  return result;
}


