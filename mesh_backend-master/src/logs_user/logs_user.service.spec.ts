import { Test, TestingModule } from '@nestjs/testing';
import { LogsUserService } from './logs_user.service';

describe('LogsUserService', () => {
  let service: LogsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsUserService],
    }).compile();

    service = module.get<LogsUserService>(LogsUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
