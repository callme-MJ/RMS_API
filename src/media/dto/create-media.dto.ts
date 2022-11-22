import { IsNotEmpty } from 'class-validator';

export class CreateMediaDTO {
  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  imageCaption: string;

  @IsNotEmpty()
  tag: string;

  youtube_link: string;

}
