const PROPERTIES = '/api/properties';
const PROPERTY_CATEGORIES = '/api/property-categories';

export const PropertiesEndpoints = {
  CREATE_PROPERTY: PROPERTIES,
  GET_PROPERTIES: PROPERTIES,
  GET_PROPERTY: (id: string) => `${PROPERTIES}/${id}`,
  UPDATE_PROPERTY: (id: string) => `${PROPERTIES}/${id}`,
  DELETE_PROPERTY: (id: string) => `${PROPERTIES}/${id}`,
} as const;

export const PropertyCategoriesEndpoints = {
  CREATE_PROPERTY_CATEGORY: PROPERTY_CATEGORIES,
  GET_PROPERTY_CATEGORIES: PROPERTY_CATEGORIES,
  GET_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
  UPDATE_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
  DELETE_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
} as const;

