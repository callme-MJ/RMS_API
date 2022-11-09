import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionDTO } from '../dto/create-session.dto';
import { Session } from '../entities/session.entity';
import { SessionService } from '../session.service';

@UseGuards(AuthGuard('jwt-use'))
@Controller('user/sessions')
export class UserSessionController {
  constructor(private readonly sessionService: SessionService) { }
  //   @Post()
  //   create(@Body() body: CreateSessionDTO) {
  //     return this.sessionService.create(body);
  //   }

  @Get()
  @SerializeOptions({ groups: ['collection'] })
  public async getSessions(): Promise<Session[]> {
    return await this.sessionService.getAllSessions();
  }

  @Get(':id')
  @SerializeOptions({ groups: ['single'] })
  public async getSession(@Param('id') id: number): Promise<Session> {
    return await this.sessionService.findByID(id);
  }
  // @Post()
  // @SerializeOptions({ groups: ['single'] }){
  //    public async createSession(@Body() body: CreateSessionDTO) : Promise<Session> {
  //     return await this.sessionService.create(body);
  // }
}
