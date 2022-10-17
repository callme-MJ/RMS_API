import { Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/not-found-exception';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>
    ) { }

    public async getAllSessions() : Promise<Session[]> {
        try {
            return await this.sessionRepository.find({
                order: {
                    createdAt: 'DESC'
                }
            });
        } catch (error) {
            throw error;
        }
    }
    
    public async findByID(id: number) : Promise<Session> {
        try {
            const session: Session = await this.sessionRepository.findOne({
                where: { id }
            });

            if(!session) {
                throw new NotFoundException("Session not found!");
            }

            return session;
        } catch (error) {
            throw error;
        }
    }
    public async create(user:Session) : Promise<Session> { 
        try{
            const session: Session = await this.sessionRepository.save(user)
            if(!session) {
                throw new NotFoundException("session not created");
            }
            return session;
        } catch (error){
            throw error;
        }

    }
    public async update(id:number,user:Session)  { 
      
             await this.sessionRepository.update(id,user)
           
       

    }
    public async remove(id:number): Promise<void>{
        try {
             this.sessionRepository.delete(id);

        } catch (error) {
            throw error;
        }
    }

}

