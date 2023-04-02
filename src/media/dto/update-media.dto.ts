import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDTO } from './create-media.dto';

export class UpdateNewsDTO extends PartialType(CreateMediaDTO) { }
