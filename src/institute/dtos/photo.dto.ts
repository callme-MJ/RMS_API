import { IsNotEmpty } from 'class-validator';

export class PhotoDTO {
  @IsNotEmpty()
  eTag: string;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  location: string;
  
}
