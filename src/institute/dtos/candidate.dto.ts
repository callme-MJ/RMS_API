import { IsNotEmpty } from "class-validator";

export class CandidateDTO{

   @IsNotEmpty()
   instituteID:string;

   @IsNotEmpty()
   name:string;

   @IsNotEmpty()
   categoryID:string;

   @IsNotEmpty()
   class:number;

   @IsNotEmpty()
   ad_no:number;

   @IsNotEmpty()
   DOB:string;

   

  chest_No:string;
  photoPath: string;

  
}