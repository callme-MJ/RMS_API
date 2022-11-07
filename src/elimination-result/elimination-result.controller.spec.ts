import { Test, TestingModule } from '@nestjs/testing';
import { EliminationResultController } from './elimination-result.controller';
import { EliminationResultService } from './elimination-result.service';

describe('EliminationResultController', () => {
  let controller: EliminationResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EliminationResultController],
      providers: [EliminationResultService],
    }).compile();

    controller = module.get<EliminationResultController>(EliminationResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
