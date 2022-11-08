import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaGalleryDto } from './create-media-gallery.dto';

export class UpdateMediaGalleryDto extends PartialType(CreateMediaGalleryDto) {}
