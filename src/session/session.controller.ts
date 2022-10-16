import { Controller, Get, Param, SerializeOptions } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
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
