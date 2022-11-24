import { IsNotEmpty } from 'class-validator';

export class CreateFinalMarkDto {
  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  pointOne: number;

  pointTwo: number;

  pointThree: number;
}
