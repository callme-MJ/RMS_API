import { Test, TestingModule } from '@nestjs/testing';
import { AdminProgramsController } from './admin-programs.controller';
import { ProgramsService } from './programs.service';

describe('ProgramsController', () => {
  let controller: AdminProgramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProgramsController],
      providers: [ProgramsService],
    }).compile();

    controller = module.get<AdminProgramsController>(AdminProgramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
