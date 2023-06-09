import { IsNotEmpty } from 'class-validator';
import { EnteringStatus, PublishingStatus } from '../entities/program.entity';
export class CreateProgramDto {
  @IsNotEmpty()
  programCode: string;

  @IsNotEmpty()
  sessionID: number;

  @IsNotEmpty()
  categoryID: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  round: string;

  @IsNotEmpty()
  mode: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  groupCount: number;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  venue: string;

  @IsNotEmpty()
  curbGroup: string;

  @IsNotEmpty()
  maxCountCurb: number;

  @IsNotEmpty()
  languageGroup: string;

  @IsNotEmpty()
  isRegisterable: string;

  @IsNotEmpty()
  isStarred: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  conceptNote: string;

  @IsNotEmpty()
  resultEntered: string;

  @IsNotEmpty()
  resultPublished: string;

  @IsNotEmpty()
  maxSelection: number;

  @IsNotEmpty()
  categoryByFeatures: string;

  @IsNotEmpty()
  skill: string;
}
