import { IsNotEmpty } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;
}