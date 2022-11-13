import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { Session, SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly sessionService: SessionService,
    private readonly coordinatorService: CoordinatorService,
  ) {}

  public async create(payload: CreateCategoryDTO): Promise<Category> {
    try {
      const session: Session = await this.sessionService.findByID(
        payload.sessionID,
      );

      return this.categoryRepository.save({ ...payload, session });
    } catch (error) {
      throw error;
    }
  }

  public async findAll(sessionID: number): Promise<Category[]> {
    try {
      return this.categoryRepository.find({
        where: {
          session: {
            id: 1,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findAllForCoordinator(session:number): Promise<Category[]> {
    try {

      const coordinator = await this.coordinatorService.findOne(session); 
      const sessionID = coordinator.session.id;
      return this.categoryRepository.find({
        where: {
          session: {
            id: sessionID,
            status: SessionStatus.ACTIVE,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<Category> {
    try {
      const category: Category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) throw new NotFoundException('Category not found');

      if (!category.session || !category.session.status) return null;

      return category;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    payload: UpdateCategoryDTO,
  ): Promise<boolean> {
    try {
      const session: Session = await this.sessionService.findByID(
        payload.sessionID,
      );

      await this.categoryRepository.save({ ...payload, id, session });
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: number) {
    try {
      await this.categoryRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
