import { PartialType } from '@nestjs/mapped-types';
import { CreateCoordinatorDto } from './create-coordinator.dto';

export class UpdateCoordinatorDto extends PartialType(CreateCoordinatorDto) {}
