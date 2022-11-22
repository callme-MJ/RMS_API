import { Test, TestingModule } from '@nestjs/testing';
import { FinalResultController } from './Final-result.controller';
import { FinalResultService } from './Final-result.service';

describe('FinalResultController', () => {
  let controller: FinalResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalResultController],
      providers: [FinalResultService],
    }).compile();

    controller = module.get<FinalResultController>(FinalResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
