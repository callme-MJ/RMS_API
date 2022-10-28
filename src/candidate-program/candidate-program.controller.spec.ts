import { Test, TestingModule } from '@nestjs/testing';
import { CandidateProgramController } from './controllers/admin-candidate-program.controller';
import { CandidateProgramService } from './candidate-program.service';

describe('CandidateProgramController', () => {
  let controller: CandidateProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateProgramController],
      providers: [CandidateProgramService],
    }).compile();

    controller = module.get<CandidateProgramController>(CandidateProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
