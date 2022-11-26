import { IsNotEmpty } from "class-validator";

export class CreateJudgeDto {
    
    @IsNotEmpty()
    name: string;

    @IsNotEmpty() 
    email: string;
    
    @IsNotEmpty()
    phoneNo: string;
}
