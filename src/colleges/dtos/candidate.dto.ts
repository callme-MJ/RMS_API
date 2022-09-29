import {IsDate, IsEmail,IsNotEmpty } from "class-validator";

export class candidateDto{

   id:number;

   @IsNotEmpty()
   institute_Id:string;

   @IsNotEmpty()
   name:string;

   @IsNotEmpty()
   category_Id:string;

   @IsNotEmpty()
   class:number;

   @IsNotEmpty()
   ad_no:number;

   @IsNotEmpty()
   dob:string;
  
}