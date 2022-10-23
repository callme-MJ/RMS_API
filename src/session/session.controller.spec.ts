import { Test, TestingModule } from '@nestjs/testing';
import { AdminSessionController } from './admin-session.controller';

describe('AdminSessionController', () => {
  let controller: AdminSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSessionController],
    }).compile();

    controller = module.get<AdminSessionController>(AdminSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
