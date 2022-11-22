import { PartialType } from '@nestjs/mapped-types';
import { CreateFinalResultDTO } from './create-Final-result.dto';

export class UpdateFinalResultDTO extends PartialType(CreateFinalResultDTO) {}
