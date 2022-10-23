import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    sessionID: number;
    
    @IsNotEmpty()
    name: string;
}
