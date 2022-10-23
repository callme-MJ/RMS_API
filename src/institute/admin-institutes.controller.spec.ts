import { Test, TestingModule } from '@nestjs/testing';
import { AdminInstitutesController } from './admin-institutes.controller';
import { InstituteService } from './institute.service';

describe('AdminInstitutesController', () => {
  let controller: AdminInstitutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminInstitutesController],
      providers: [InstituteService],
    }).compile();

    controller = module.get<AdminInstitutesController>(AdminInstitutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
