import { IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from '../entities/candidate.entity';

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

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  chestNO?: any;
}
