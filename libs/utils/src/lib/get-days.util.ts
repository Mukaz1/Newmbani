export function getDaysFromDates(data: {
  checkIn: Date | string;
  checkOut: Date | string;
}): number {
  const { checkIn, checkOut } = data;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
