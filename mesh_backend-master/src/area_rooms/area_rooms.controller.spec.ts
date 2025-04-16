import { Test, TestingModule } from '@nestjs/testing';
import { AreaRoomsController } from './area_rooms.controller';

describe('AreaRoomsController', () => {
  let controller: AreaRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaRoomsController],
    }).compile();

    controller = module.get<AreaRoomsController>(AreaRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
