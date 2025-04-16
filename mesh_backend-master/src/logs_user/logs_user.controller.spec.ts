import { Test, TestingModule } from '@nestjs/testing';
import { LogsUserController } from './logs_user.controller';

describe('LogsUserController', () => {
  let controller: LogsUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsUserController],
    }).compile();

    controller = module.get<LogsUserController>(LogsUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
