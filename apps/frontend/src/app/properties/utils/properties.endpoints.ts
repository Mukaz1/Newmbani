import { APIBaseAPIUrl } from '../../common/base-api-url';

const PROPERTIES = `${APIBaseAPIUrl}/properties`;
const PROPERTY_IMAGE_CATEGORIES = `${APIBaseAPIUrl}/property-image-categories`;
const PROPERTY_IMAGES = `${APIBaseAPIUrl}/property-images`;

export const propertiesEndpoints = {
  CREATE_PROPERTY: PROPERTIES,
  GET_PROPERTIES: PROPERTIES,
  GET_PROPERTY: (id: string) => `${PROPERTIES}/${id}`,
  UPDATE_PROPERTY: (id: string) => `${PROPERTIES}/${id}`,
  DELETE_PROPERTY: (id: string) => `${PROPERTIES}/${id}`,
  REVIEW_PROPERTY: (id: string) => `${PROPERTIES}/${id}/review`,
} as const;

export const propertyImageCategoriesEndpoints = {
  CREATE_PROPERTY_IMAGE_CATEGORY: PROPERTY_IMAGE_CATEGORIES,
  GET_PROPERTY_IMAGE_CATEGORIES: PROPERTY_IMAGE_CATEGORIES,
  GET_PROPERTY_IMAGE_CATEGORY: (id: string) =>
    `${PROPERTY_IMAGE_CATEGORIES}/${id}`,
  UPDATE_PROPERTY_IMAGE_CATEGORY: (id: string) =>
    `${PROPERTY_IMAGE_CATEGORIES}/${id}`,
  DELETE_PROPERTY_IMAGE_CATEGORY: (id: string) =>
    `${PROPERTY_IMAGE_CATEGORIES}/${id}`,
} as const;

export const propertyImagesEndpoints = {
  UPLOAD_PROPERTY_IMAGE: PROPERTY_IMAGES,
  GET_PROPERTY_IMAGES: PROPERTY_IMAGES,
  GET_PROPERTY_IMAGE: (id: string) => `${PROPERTY_IMAGES}/${id}`,
  REVIEW_PROPERTY_IMAGE: (id: string) => `${PROPERTY_IMAGES}/${id}/review`,
  UPDATE_PROPERTY_IMAGE: (id: string) => `${PROPERTY_IMAGES}/${id}`,
  DELETE_PROPERTY_IMAGE: (id: string) => `${PROPERTY_IMAGES}/${id}`,
} as const;
