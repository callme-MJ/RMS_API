import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateCodeLetterDto {
  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  codeLetter: string;
}
