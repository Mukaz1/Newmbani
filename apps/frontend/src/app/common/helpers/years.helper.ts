/**
 * Generates an array of years between a start and end year.
 *
 * @param data - Object with startYear and optional endYear properties.
 * @returns Array of numbers representing years between start and end.
 */
export function generateYearsBetween(data: {
  startYear: number;
  endYear?: number;
}) {
  let { startYear, endYear } = data;
  const endDate = endYear || new Date().getFullYear();
  let years = [];

  for (let i = startYear; i <= endDate; i++) {
    years.push(startYear);
    startYear++;
  }
  return years;
}
