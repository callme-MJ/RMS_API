import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { Puppeteer } from 'puppeteer';
import { PdfGenerateService } from './pdf-generate.service';
import { CreatePdfGenerateDto } from './dto/create-pdf-generate.dto';
import { UpdatePdfGenerateDto } from './dto/update-pdf-generate.dto';
import {  Response } from 'express';

@Controller('pdf')
export class PdfGenerateController {
  constructor(private readonly pdfGenerateService: PdfGenerateService) {}


  @Get('')
  async getPDF(@Res()res:Response) {
  return this.pdfGenerateService.getpdf().then(pdf => {
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
    res.send(pdf)
  })
//   this.getPDF().then(pdf => {
//     res.status(200).header({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length }).send(pdf);
// })
  }

  @Post()
  create(@Body() createPdfGenerateDto: CreatePdfGenerateDto) {
    return this.pdfGenerateService.create(createPdfGenerateDto);
  }

  @Get()
  findAll() {
    return this.pdfGenerateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdfGenerateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePdfGenerateDto: UpdatePdfGenerateDto) {
    return this.pdfGenerateService.update(+id, updatePdfGenerateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdfGenerateService.remove(+id);
  }
}
