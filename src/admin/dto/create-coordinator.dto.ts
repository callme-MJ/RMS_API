import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateCoordinatorDto {
    @IsNotEmpty()
    id:number;

    @IsNotEmpty()
    firstName:string;
    
    @IsNotEmpty()
    lastName:string;
    
    @IsNotEmpty()
    userName:string;
    
    @IsNotEmpty()
    password:string;

    @IsEmail()
    email:string;

    @IsNotEmpty()
    phone_no:string;

    @IsNotEmpty()
    institute_id:number
}
