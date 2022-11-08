import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // TODO: remove this endpoint once CI/CD tested
  @Get('test-ci')
  testCICD(): string {
    return "Hi! CI has worked";
  }
}
