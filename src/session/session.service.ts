import { Injectable } from '@nestjs/common';
import { Session, SessionStatus } from './entities/session.entity';
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
    
    public async findByID(id: number, status: SessionStatus = SessionStatus.ACTIVE) : Promise<Session> {
        try {
            const session: Session = await this.sessionRepository.findOne({
                where: { id, status }
            });

            if(!session) {
                throw new NotFoundException("Session not found!");
            }

            return session;
        } catch (error) {
            throw error;
        }
    }
}
