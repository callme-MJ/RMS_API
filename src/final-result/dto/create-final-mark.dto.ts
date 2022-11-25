import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFinalMarkDto {
  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  pointOne: number;

  @Max(100)
  pointTwo: number;

  @Max(100)
  pointThree: number;
}
