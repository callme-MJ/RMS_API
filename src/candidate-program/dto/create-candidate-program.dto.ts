import { IsNotEmpty } from 'class-validator';

export class CreateCandidateProgramDTO {

    @IsNotEmpty()
    chestNO:number;
 
    @IsNotEmpty()
    programCode:string;
 
    @IsNotEmpty()
    categoryID:string;
 
    @IsNotEmpty()
    name:string;
}