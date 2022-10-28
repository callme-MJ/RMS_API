import { IsNotEmpty } from 'class-validator';

export class CreateCoordinatorDto {

    @IsNotEmpty()
    instituteID: number;

    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;
   
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phoneNO: string;

    @IsNotEmpty()
    email: string;
}
