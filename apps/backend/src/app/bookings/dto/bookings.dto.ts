import { BookingStatusEnum, CreateBooking, PostCreateBooking } from "@newmbani/types";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

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

export class PostCreateBookingDto  extends CreateBookingDto implements PostCreateBooking {
    @IsString()
    createdBy: string;
   

    @IsDate()
    createdAt: Date;
   

    @IsNotEmpty()
    @IsEnum(BookingStatusEnum)
    status:BookingStatusEnum
}