import { IsNotEmpty } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    s_time: string;

    @IsNotEmpty()
    venue: string;
    
    @IsNotEmpty()
    e_time: string;
  
}