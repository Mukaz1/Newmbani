import { AUTH_ENDPOINTS } from "./auth.endpoints";
import { BOOKINGS_ENDPOINTS } from "./bookings.endpoints";
import { LANDLORDS_ENDPOINTS } from "./landlords.endpoints";
import { NOTIFICATIONS_ENDPOINTS } from "./notifications.endpoints";
import { PROPERTIES_ENDPOINTS } from "./properties.endpoints";
import { CUSTOMERS_ENDPOINTS } from "./customers.endpoints";
import { USERS_ENDPOINTS } from "./users.endpoints";

export const API_ENDPOINTS = {
    ...AUTH_ENDPOINTS,
    ...PROPERTIES_ENDPOINTS,
    ...BOOKINGS_ENDPOINTS,
    ...LANDLORDS_ENDPOINTS,
    ...NOTIFICATIONS_ENDPOINTS,
    ...CUSTOMERS_ENDPOINTS,
    ...USERS_ENDPOINTS,

}
