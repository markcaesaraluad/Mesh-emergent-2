import { Test, TestingModule } from '@nestjs/testing';
import { TimeShiftsController } from './time_shifts.controller';

describe('TimeShiftsController', () => {
  let controller: TimeShiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeShiftsController],
    }).compile();

    controller = module.get<TimeShiftsController>(TimeShiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
