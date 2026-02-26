/**
 * Adds a country code to a phone number if it's missing.
 * Ensures no '+' sign in the final output.
 * @param phoneNumber The phone number (string or number).
 * @param countryCode The country code to add (e.g., "254").
 * @returns A normalized phone number with the country code.
 */
export function addCountryCode(
    phoneNumber: string | number,
    countryCode: string
  ): string {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }
  
    let normalized = phoneNumber.toString().trim();
    const code = countryCode.replace(/^\+/, "").trim(); // remove '+' from code if present
  
    // Remove any '+' from phone number
    normalized = normalized.replace(/^\+/, "");
  
    // If already starts with country code, return as is
    if (normalized.startsWith(code)) {
      return normalized;
    }
  
    // Remove leading zeros
    normalized = normalized.replace(/^0+/, "");
  
    // Append country code
    return `${code}${normalized}`;
  }