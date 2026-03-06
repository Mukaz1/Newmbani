import { LandlordApprovalStatus } from "@newmbani/types";
import { IsNotEmpty, IsString } from "class-validator";

export class ApproveLandlordDto {

  @IsString()
  @IsNotEmpty()
  approvalStatus: LandlordApprovalStatus;
  
  @IsString()
  @IsNotEmpty()
  approvedBy: string;   

  @IsString()
  @IsNotEmpty()
  approvalComment: string;

}