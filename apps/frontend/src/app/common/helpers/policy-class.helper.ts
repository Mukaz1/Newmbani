/**
 * Checks if the given subClass string indicates a third party and/or commercial policy class.
 *
 * @param subClass - The subClass string to check
 * @returns Object with boolean values indicating if subClass is third party and/or commercial
 */
export function checkIfClassIsThirdPartyAndCommercial(subClass: string): {
  isThirdParty: boolean;
  isCommercial: boolean;
} {
  let isThirdParty;
  let isCommercial;
  if (subClass.includes('THIRD_PARTY')) {
    isThirdParty = true;
  } else {
    isThirdParty = false;
  }

  if (subClass.includes('COMMERCIAL')) {
    isCommercial = true;
  } else {
    isCommercial = false;
  }
  return {
    isThirdParty,
    isCommercial,
  };
}
