import { IsNotEmpty } from "class-validator";

export class CreateMediaGalleryDto {
    @IsNotEmpty()
    sessionID: number;
    
    @IsNotEmpty()
    content: string;

}
