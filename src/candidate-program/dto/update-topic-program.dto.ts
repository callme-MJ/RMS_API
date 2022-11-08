import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicProgramDTO } from './create-topic-program.dto';

export class UpdateTopicProgramDTO extends PartialType(
  CreateTopicProgramDTO,
) {}
