import { IsNotEmpty } from 'class-validator';

export class CreateTopicProgramDTO {
  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  categoryID: number;

  @IsNotEmpty()
  programName: string;

  @IsNotEmpty()
  instituteID: number;

  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  link: string;
}
