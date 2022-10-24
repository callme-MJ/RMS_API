import { Body, Controller, Delete, Get, Param, Post, Put, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/sessions')
export class AdminSessionController {
    constructor(private readonly sessionService: SessionService)
    { }

    @Get()
    @SerializeOptions({ groups: ['collection'] })
    public async getSessions() : Promise<Session[]> {
        return await this.sessionService.getAllSessions();
    }
    
    @Get(":id")
    @SerializeOptions({ groups: ['single'] })
    public async getSession(@Param('id') id: number) : Promise<Session> {
        return await this.sessionService.findByID(id);
    }
    @Post()
    @SerializeOptions({ groups: ['collection'] })
    public async create(@Body('createSessionDto')CreateSessionDTO: Session) : Promise<Session> {
        return await this.sessionService.create(CreateSessionDTO);
    }

    @Put(":id")
    @SerializeOptions({ groups: ['single'] })
    public async update(@Param('id')id:number,@Body('updateSesionDTO')UpdateSesionDTO: Session) : Promise<void> {
        return await this.sessionService.update(id,UpdateSesionDTO);
    }
    @Delete()
    @SerializeOptions({ groups: ['collection'] })
    public async delete(@Body('id') id: number) : Promise<void> {
        return await this.sessionService.remove(id);
    }
}

