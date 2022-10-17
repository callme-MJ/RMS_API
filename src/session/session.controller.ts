import { Controller, Get, Param, SerializeOptions,Body,Post,Put,Delete } from '@nestjs/common';
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
    @Post()
    @SerializeOptions({ groups: ['collection'] })
    public async create(@Body('createUserDto')createUserDto: Session) : Promise<Session> {
        return await this.sessionService.create(createUserDto);
    }

    @Put(":id")
    @SerializeOptions({ groups: ['single'] })
    public async update(@Param('id')id:number,@Body('createUserDto')createUserDto: Session) : Promise<void> {
        return await this.sessionService.update(id,createUserDto);
    }
    @Delete()
    @SerializeOptions({ groups: ['collection'] })
    public async delete(@Body('id') id: number) : Promise<void> {
        return await this.sessionService.remove(id);
    }
}

