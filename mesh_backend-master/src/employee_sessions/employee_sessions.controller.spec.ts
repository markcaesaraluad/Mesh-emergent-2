import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeSessionsController } from './employee_sessions.controller';

describe('EmployeeSessionsController', () => {
  let controller: EmployeeSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeSessionsController],
    }).compile();

    controller = module.get<EmployeeSessionsController>(EmployeeSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
