import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello  eeeeWorld! This is first Sibaq\'22 API response";
  }
}
