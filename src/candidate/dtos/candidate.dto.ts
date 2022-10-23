import { IsNotEmpty } from 'class-validator';

export class CandidateDTO {
  @IsNotEmpty()
  instituteID: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryID: number;

  @IsNotEmpty()
  class: number;

  @IsNotEmpty()
  adno: number;

  @IsNotEmpty()
  dob: string;

  chestNO?: any;
}
