import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      data: 'Hello World..! This is first Sibaq\'22 API response',
      success: true
    };
  }
}
