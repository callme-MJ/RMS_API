import { IsNotEmpty } from 'class-validator';
import { Photo } from 'src/candidate/interfaces/photo.entitiy';

export class CreateNewsDTO {
  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  imageCaption: string;

  @IsNotEmpty()
  tag: string;
}
