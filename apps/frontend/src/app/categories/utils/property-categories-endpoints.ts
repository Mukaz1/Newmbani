import { APIBaseAPIUrl } from "../../common/base-api-url";

export const propertyCategoriesEndpoints = {
    // Categories
    PROPERTY_CATEGORIES: `${APIBaseAPIUrl}/property-categories`,
    CREATE_PROPERTY_CATEGORY: `${APIBaseAPIUrl}/property-categories`,
    UPDATE_PROPERTY_CATEGORY: `${APIBaseAPIUrl}/property-categories`,
    VIEW_PROPERTY_CATEGORY: `${APIBaseAPIUrl}/property-categories`,

    // property-subcategories
    ALL_SUB_CATEGORIES: `${APIBaseAPIUrl}/property-subcategories`,
    GET_PROPERTY_SUBCATEGORY: `${APIBaseAPIUrl}/property-subcategories`,
    CREATE_PROPERTY_SUBCATEGORY: `${APIBaseAPIUrl}/property-subcategories`,
    UPDATE_PROPERTY_SUBCATEGORY: `${APIBaseAPIUrl}/property-subcategories`,
    DELETE_PROPERTY_SUBCATEGORY: `${APIBaseAPIUrl}/property-subcategories`,
};
