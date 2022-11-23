import { IsNotEmpty } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    time: string;

    @IsNotEmpty()
    venue: number;
  
}