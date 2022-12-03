import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import path from 'path';
import { CreatePdfGenerateDto } from './dto/create-pdf-generate.dto';
import { UpdatePdfGenerateDto } from './dto/update-pdf-generate.dto';
import * as fs from 'fs'; 

@Injectable()
export class PdfGenerateService {
  create(createPdfGenerateDto: CreatePdfGenerateDto) {
    return 'This action adds a new pdfGenerate';
  }

//start
async getpdf(){
  const puppeteer = require('puppeteer')
  try {
    
    
    // async function printPDF() {
      const browser = await puppeteer.launch({ 
        headless: true,
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--disable-extensions']
    });
      const page = await browser.newPage();
      await page.goto('https://sibaq.in/pdf-gen', {
        waitUntil: 'networkidle0'
    });
      const pdf = await page.pdf({ format: 'A4',printBackground:true });
      
      await browser.close();
      return pdf;
      
    } catch (error) {
      throw error
    }

}

async generatePDF(): Promise<Buffer> {
  const content = fs.readFileSync(
    path.resolve(__dirname, './templates/pdf.html'),
    'utf-8'
  )

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(content)

  const buffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px'
    }
  })

  await browser.close()

  return buffer
}
//end


//start 2
// const browser = await puppeteer.launch({ headless: true });
//     const page = await this.browser.newPage();
//     await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});


//     var options = {
//       width: '1230px',
//       displayHeaderFooter: false,
//       margin: {
//         top: "10px",
//         bottom: "30px"
//       },
//       printBackground: true,
//     }

//     const pdf = await page.pdf(options);
  
//     await browser.close();
//     return pdf
  

//end 2

  findAll() {
    return `This action returns all pdfGenerate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdfGenerate`;
  }

  update(id: number, updatePdfGenerateDto: UpdatePdfGenerateDto) {
    return `This action updates a #${id} pdfGenerate`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdfGenerate`;
  }
}
