import { PartialType } from '@nestjs/mapped-types';
import { CreateEliminationResultDto } from './create-elimination-result.dto';

export class UpdateEliminationResultDto extends PartialType(CreateEliminationResultDto) {}
