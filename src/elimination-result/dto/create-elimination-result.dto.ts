import { IsNotEmpty } from "class-validator";

export class CreateEliminationResultDto {


  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  pointOne: number;

  pointTwo: number;

  pointThree: number;

}
