import { IsNotEmpty } from "class-validator";

export class CreateInstituteDTO {
    @IsNotEmpty()
    sessionID: number;
    
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    shortName: string;
    
    @IsNotEmpty()
    address: string;
}
