import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDTO } from './create-session.dto';

export class UpdateSesionDTO extends PartialType(CreateSessionDTO) {}
