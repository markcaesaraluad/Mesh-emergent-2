import { Test, TestingModule } from '@nestjs/testing';
import { UserLogsController } from './user_logs.controller';

describe('UserLogsController', () => {
  let controller: UserLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLogsController],
    }).compile();

    controller = module.get<UserLogsController>(UserLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
