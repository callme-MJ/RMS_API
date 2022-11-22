import { Test, TestingModule } from '@nestjs/testing';
import { FinalResultService } from './Final-result.service';

describe('FinalResultService', () => {
  let service: FinalResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalResultService],
    }).compile();

    service = module.get<FinalResultService>(FinalResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
