import { IsNotEmpty } from "class-validator";

export class CreateFinalResultDTO {


  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  pointOne: number;

  pointTwo: number;

  pointThree: number;


}
