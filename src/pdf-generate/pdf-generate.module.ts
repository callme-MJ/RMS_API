import { Module } from '@nestjs/common';
import { PdfGenerateService } from './pdf-generate.service';
import { PdfGenerateController } from './pdf-generate.controller';

@Module({
  controllers: [PdfGenerateController],
  providers: [PdfGenerateService]
})
export class PdfGenerateModule {}
