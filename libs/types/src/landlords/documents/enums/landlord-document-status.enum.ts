export enum LandlordDocumentStatus {
  UNSUBMITTED = 'UNSUBMITTED', // Awaiting landlord action or approval
  SUBMITTED = 'submitted', // Uploaded and ready for review
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
