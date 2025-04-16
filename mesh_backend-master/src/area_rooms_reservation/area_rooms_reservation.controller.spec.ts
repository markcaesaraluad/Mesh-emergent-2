import { Test, TestingModule } from '@nestjs/testing';
import { AreaRoomsReservationController } from './area_rooms_reservation.controller';

describe('AreaRoomsReservationController', () => {
  let controller: AreaRoomsReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaRoomsReservationController],
    }).compile();

    controller = module.get<AreaRoomsReservationController>(AreaRoomsReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
