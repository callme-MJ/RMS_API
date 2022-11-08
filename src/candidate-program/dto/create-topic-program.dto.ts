import { IsNotEmpty } from 'class-validator';

export class CreateTopicProgramDTO {
  @IsNotEmpty()
  chestNO: number;

  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  link: string;
}
