export function formatToMpesaNumber(phone: string | number): string | null {
  // Convert to string and trim spaces
  let cleaned = String(phone).trim();

  // Remove all non-digit characters
  cleaned = cleaned.replace(/\D/g, '');

  // Handle common formats
  if (cleaned.startsWith('0')) {
    // 07XXXXXXXX / 01XXXXXXXX → 2547XXXXXXXX / 2541XXXXXXXX
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    // 7XXXXXXXX / 1XXXXXXXX → 2547XXXXXXXX / 2541XXXXXXXX
    cleaned = '254' + cleaned;
  } else if (cleaned.startsWith('+254')) {
    // +2547XXXXXXXX / +2541XXXXXXXX → 2547XXXXXXXX / 2541XXXXXXXX
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    // Already correct → do nothing
  } else {
    return null;
  }

  // Validate final format (must be 2547XXXXXXXX or 2541XXXXXXXX)
  if (!/^254(7|1)\d{8}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}
