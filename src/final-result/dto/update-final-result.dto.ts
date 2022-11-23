import { PartialType } from '@nestjs/mapped-types';
import { CreateFinalResultDTO } from './create-final-result.dto';

export class UpdateFinalResultDTO extends PartialType(CreateFinalResultDTO) {}
