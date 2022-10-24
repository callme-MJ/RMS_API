import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/sessions')
export class AdminSessionController {
  constructor(private readonly sessionService: SessionService) {}

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
  @Post()
  @SerializeOptions({ groups: ['single'] })
  public async create(@Body() CreateSessionDTO: Session): Promise<Session> {
    return await this.sessionService.create(CreateSessionDTO);
  }

  @Put(':id')
  @SerializeOptions({ groups: ['single'] })
  public async update(
    @Param('id') id: number,
    @Body('updateSesionDTO') UpdateSesionDTO: Session,
  ): Promise<boolean> {
    await this.sessionService.update(id, UpdateSesionDTO);
    return true;
  }
  @Delete()
  @SerializeOptions({ groups: ['single'] })
  public async delete(@Param('id') id: number): Promise<boolean> {
    await this.sessionService.remove(id);
    return true;
  }
}
