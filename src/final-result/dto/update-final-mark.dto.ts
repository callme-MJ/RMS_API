import { PartialType } from '@nestjs/mapped-types';
import { CreateFinalMarkDto } from './create-final-mark.dto';

export class UpdateFinalMarkDto extends PartialType(CreateFinalMarkDto) {}
