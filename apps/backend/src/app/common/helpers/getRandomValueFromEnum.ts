/**
 * Gets a random value from an enum.
 *
 * @example
 * enum MyEnum {
 *   A,
 *   B,
 *   C
 * }
 *
 * const randomEnumValue = getRandomEnumValue(MyEnum);
 *
 * @param enumObj The enum to get a value from.
 * @returns A random value from the enum.
 */
export function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const enumValues = Object.values(enumObj) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
