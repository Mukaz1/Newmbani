import { RiskNoteTypeEnum } from 'src/app/underwriting/enums/risk-notes-types.enum';

export const checkIfIsEndorsement = (riskNoteType: RiskNoteTypeEnum) => {
  return (
    riskNoteType === RiskNoteTypeEnum.ADDITIONAL_PREMIUM ||
    riskNoteType === RiskNoteTypeEnum.REFUND ||
    riskNoteType === RiskNoteTypeEnum.COMESA ||
    riskNoteType === RiskNoteTypeEnum.LAPSE ||
    riskNoteType === RiskNoteTypeEnum.NIL
  );
};
