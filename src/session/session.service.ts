import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';
import { CreateSessionDTO } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public async getAllSessions(): Promise<Session[]> {
    try {
      return await this.sessionRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findByID(
    id: number,
    status: SessionStatus = SessionStatus.ACTIVE,
  ): Promise<Session> {
    try {
      const session: Session = await this.sessionRepository.findOne({
        where: { id, status },
      });

      if (!session) {
        throw new NotFoundException('Session not found!');
      }

      return session;
    } catch (error) {
      throw error;
    }
  }
  public async create(session: Session): Promise<Session> {
    try {
      const newSession: Session = await this.sessionRepository.save(session);
      return newSession;
    } catch (error) {
      throw error;
    }
  }
  public async update(id: number, session: Session): Promise<boolean> {
    try {
      const session: Session = await this.sessionRepository.findOne({
        where: { id },
      });
      if (!session) {
        throw new NotFoundException('session not found');
      }
      await this.sessionRepository.update(id, session);
      return true;
    } catch (error) {
      throw error;
    }
  }
  public async remove(id: number): Promise<boolean> {
    try {
      this.sessionRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

    // public async create(payload: CreateSessionDTO) : Promise<Session[]> {
    //     try {
    //         return await this.sessionRepository.save(payload);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

}
