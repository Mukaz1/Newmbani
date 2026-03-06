import { BookingStatusEnum, CreateBooking } from "@newmbani/types";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto implements CreateBooking {
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @IsString()
    @IsNotEmpty()
    propertyId: string;

    @IsString()
    @IsNotEmpty()
    viewingDate: string;

}

export class PostCreateBooking implements PostCreateBooking {
    @IsNotEmpty()
    @IsEnum(BookingStatusEnum)
    status:BookingStatusEnum
}