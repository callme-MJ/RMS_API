import { PartialType } from '@nestjs/mapped-types';
import { CreatePdfGenerateDto } from './create-pdf-generate.dto';

export class UpdatePdfGenerateDto extends PartialType(CreatePdfGenerateDto) {}
