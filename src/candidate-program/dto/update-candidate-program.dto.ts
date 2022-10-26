import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateProgramDTO } from './create-candidate-program.dto';

export class UpdateCandidateProgramDTO extends PartialType(CreateCandidateProgramDTO) {}
