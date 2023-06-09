import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateTopicStatusDTO {
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

//   @IsNotEmpty()
//   @IsEnum(Status)
//   status:Status;
}
