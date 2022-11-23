import { PartialType } from '@nestjs/mapped-types';
import { CreateFinalMarkDto } from './create-final-Mark.dto';

export class UpdateFinalMarkDto extends PartialType(CreateFinalMarkDto) {}
