import { APIBaseAPIUrl } from "../../common/base-api-url";

const PROPERTY_CATEGORIES = `${APIBaseAPIUrl}/property-categories`


export const propertyCategoriesEndpoints = {
    CREATE_PROPERTY_CATEGORY: PROPERTY_CATEGORIES,
    GET_PROPERTY_CATEGORIES: PROPERTY_CATEGORIES,
    GET_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
    UPDATE_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
    DELETE_PROPERTY_CATEGORY: (id: string) => `${PROPERTY_CATEGORIES}/${id}`,
  } as const;
  