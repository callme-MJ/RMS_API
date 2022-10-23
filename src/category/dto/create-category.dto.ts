import { IsNotEmpty } from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty()
    sessionID: number;
    
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    chestNoSeries: number;
}
