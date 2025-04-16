import { Test, TestingModule } from '@nestjs/testing';
import { TimeShiftsService } from './time_shifts.service';

describe('TimeShiftsService', () => {
  let service: TimeShiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeShiftsService],
    }).compile();

    service = module.get<TimeShiftsService>(TimeShiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
