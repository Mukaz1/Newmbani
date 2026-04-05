import { CancelBooking, PostCancelBooking } from '@newmbani/types';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBookingCancellationDto implements CancelBooking {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reason: string;
}

export class PostCancelBookingDto  extends CreateBookingCancellationDto implements PostCancelBooking {
    @IsString()
    createdBy: string;
   

    @IsDate()
    createdAt: Date;
   
}
