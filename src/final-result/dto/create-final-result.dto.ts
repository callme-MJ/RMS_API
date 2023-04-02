import { IsNotEmpty } from 'class-validator';

export class CreateFinalResultDTO {
  @IsNotEmpty()
  position: string;
}
