/**
 * Returns a random number between the given min and max values, inclusive.
 * @param {number} min The minimum value of the range.
 * @param {number} max The maximum value of the range.
 * @returns {number} A random number between min and max.
 */
export function getRandomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
