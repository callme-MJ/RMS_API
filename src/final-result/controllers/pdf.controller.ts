import { Controller, Get, Param, Render } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { FinalResultService } from '../final-result.service';

@Controller('pdf')
export class PDFController {
  constructor(
    private readonly finalResultService: FinalResultService,
  ){}

  @Get('/:code')
  @Render("")
  async generatePdf(@Param('code') code: string) {
    try {
      const data = await this.finalResultService.getResultOfProgram(code);

      console.log(data);

      // const compile = async (data: any) => {
      //   const html = await template(filePath);
      //   return Handlebars.compile(html)(data);

      // }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(data.toString()); ;
      await page.emulateMediaType('screen');
      await page.pdf({
        path: 'hello.pdf',
        format: 'A4',
        printBackground: true,
      })
      await browser.close();

    } catch (error) {
      throw error;
    }
    return 'Hello World';
  }

}