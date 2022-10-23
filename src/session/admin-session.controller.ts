import { Controller, Get, Param, SerializeOptions, UseGuards } from '@nestjs/common';
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
}
