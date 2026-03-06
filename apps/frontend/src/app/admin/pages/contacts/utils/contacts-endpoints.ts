import { APIBaseAPIUrl } from "../../../../common/base-api-url";

export const contactsEndpoints = {
  CREATE_CONTACT_MESSAGE: `${APIBaseAPIUrl}/customer-contacts`,
  VIEW_CONTACT_MESSAGES: `${APIBaseAPIUrl}/customer-contacts`,
  VIEW_CONTACT_MESSAGE: `${APIBaseAPIUrl}/customer-contacts`,
  DELETE_CONTACT_MESSAGE: `${APIBaseAPIUrl}/customer-contacts`,
  GET_CONTACT_MESSAGE_BY_ID: `${APIBaseAPIUrl}/customer-contacts`,
};
