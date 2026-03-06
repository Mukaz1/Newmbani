import { AuditData } from '../../common/audit-data';
import { FileInterface } from '../../files';
import { PropertyImageApprovalStatus } from '../enums/property-image-approval-status.enum';
import { Property } from './property';
import { PropertyImageCategory } from './property-image-category';

export interface CreatePropertyImage {
  propertyId: string;
  propertyImageCategoryId: string;
  description: string;
}
export interface PostPropertyImage extends CreatePropertyImage {
  fileId?: string;
  link?: string;
  createdAt: Date;
  createdBy: string;
}

export interface UpdatePropertyImage {
  propertyImageCategoryId: string;
}

export interface PropertyImage extends PostPropertyImage, AuditData {
  _id: string;
  approvalStatus: PropertyImageApprovalStatus;
  property: Property;
  propertyImageCategory: PropertyImageCategory;
  file?: FileInterface;
}


export interface PropertyImageReviewInterface {
  status: PropertyImageApprovalStatus;
  comment?: string;
}
