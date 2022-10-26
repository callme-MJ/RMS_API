import { Test, TestingModule } from '@nestjs/testing';
import { CandidateProgramService } from './candidate-program.service';

describe('CandidateProgramService', () => {
  let service: CandidateProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateProgramService],
    }).compile();

    service = module.get<CandidateProgramService>(CandidateProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
