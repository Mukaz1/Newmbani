export function camelCaseToWords(text: string): string {
    if (!text) return '';
  
    return text
      // Insert a space before all caps
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Handle multiple consecutive caps (e.g., "getHTTPResponse" -> "get HTTP Response")
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      // Lowercase the first letter for readability
      .replace(/^./, (str) => str.charAt(0).toLowerCase());
  }