import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    // @IsNotEmpty()
    // id:number;

    @IsNotEmpty()
    firstName:string;
    
    @IsNotEmpty()
    lastName:string;
    
    @IsNotEmpty()
    username:string;
    
    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    role:number;
}
