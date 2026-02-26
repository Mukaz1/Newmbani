export function getDisabledDates(
  bookings: { checkIn: string; checkOut: string }[]
): string[] {
  const disabledDates: string[] = [];

  bookings.forEach(({ checkIn, checkOut }) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let current = new Date(start);

    while (current <= end) {
      // Format to YYYY-MM-DD for easy comparison with datepickers
      disabledDates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  return disabledDates;
}
