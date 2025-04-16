import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeSessionsService } from './employee_sessions.service';

describe('EmployeeSessionsService', () => {
  let service: EmployeeSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeSessionsService],
    }).compile();

    service = module.get<EmployeeSessionsService>(EmployeeSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
