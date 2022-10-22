import { IsNotEmpty } from 'class-validator';

export class CandidateDTO {
  @IsNotEmpty()
  instituteID: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryID: string;

  @IsNotEmpty()
  class: number;

  @IsNotEmpty()
  adno: number;

  @IsNotEmpty()
  dob: string;
  photo: import("c:/Users/HP/Desktop/sibaq github/rms-api/src/institute/entities/photo.entitiy").Photo;
  chestNO: any;



}
