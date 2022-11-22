import { IsNotEmpty } from 'class-validator';

export class CreateGalleryDTO {
  @IsNotEmpty()
  imageCaption: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  tag: string;
}
