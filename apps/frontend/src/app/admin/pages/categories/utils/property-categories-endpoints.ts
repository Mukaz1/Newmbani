import { APIBaseAPIUrl } from '../../../../common/base-api-url';

const PROPERTY_CATEGORIES = `${APIBaseAPIUrl}/property-categories`;
const PROPERTY_SUBCATEGORIES = `${APIBaseAPIUrl}/property-subcategories`;

export const propertyCategoriesEndpoints = {
  CREATE_PROPERTY_CATEGORY: PROPERTY_CATEGORIES,
  GET_PROPERTY_CATEGORIES: PROPERTY_CATEGORIES,
  GET_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
  UPDATE_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
  DELETE_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
} as const;

export const propertySubCategoriesEndpoints = {
  CREATE_PROPERTY_SUBCATEGORY: PROPERTY_SUBCATEGORIES,
  GET_PROPERTY_SUBCATEGORIES: PROPERTY_SUBCATEGORIES,
  GET_PROPERTY_SUBCATEGORY: (id: string) => `${PROPERTY_SUBCATEGORIES}/${id}`,
  UPDATE_PROPERTY_SUBCATEGORY: (id: string) =>
    `${PROPERTY_SUBCATEGORIES}/${id}`,
  DELETE_PROPERTY_SUBCATEGORY: (id: string) =>
    `${PROPERTY_SUBCATEGORIES}/${id}`,
} as const;
