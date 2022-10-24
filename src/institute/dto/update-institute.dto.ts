import { PartialType } from '@nestjs/mapped-types';
import { CreateInstituteDTO } from './create-institute.dto';

export class UpdateInstituteDTO extends PartialType(CreateInstituteDTO) {}
