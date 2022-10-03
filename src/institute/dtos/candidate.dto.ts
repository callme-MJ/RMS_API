import { IsNotEmpty } from "class-validator";

export class CandidateDTO{

   @IsNotEmpty()
   institute_ID:string;

   @IsNotEmpty()
   name:string;

   @IsNotEmpty()
   category_ID:string;

   @IsNotEmpty()
   class:number;

   @IsNotEmpty()
   ad_no:number;

   @IsNotEmpty()
   dob:string;

  chest_No:number;
  photoPath: any;

  
}