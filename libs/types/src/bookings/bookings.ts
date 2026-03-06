import { AuditData } from "../audit";
import { Property } from "../properties";
import { Customer } from "../customers";
import { BookingStatusEnum } from "./enums/bookings-status.enum";

export interface CreateBooking {
    customerId : string;
    propertyId: string;
    viewingDate: string;
}

export interface PostCreateBooking extends CreateBooking {
    status:BookingStatusEnum
    createdBy: string;
}

export interface Booking extends PostCreateBooking, AuditData {
customer:Customer;
property:Property
}