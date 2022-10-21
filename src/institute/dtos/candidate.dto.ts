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
   adno:number;

   @IsNotEmpty()
   dob:string;

   

  chestNO:string;
  photoPath: string;

  
}