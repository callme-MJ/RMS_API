import { Test, TestingModule } from '@nestjs/testing';
import { EliminationResultService } from './elimination-result.service';

describe('EliminationResultService', () => {
  let service: EliminationResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EliminationResultService],
    }).compile();

    service = module.get<EliminationResultService>(EliminationResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
