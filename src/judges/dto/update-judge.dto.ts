import { PartialType } from '@nestjs/mapped-types';
import { CreateJudgeDto } from './create-judge.dto';

export class UpdateJudgeDto extends PartialType(CreateJudgeDto) {}
