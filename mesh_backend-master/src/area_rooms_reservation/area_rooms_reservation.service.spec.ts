import { Test, TestingModule } from '@nestjs/testing';
import { AreaRoomsReservationService } from './area_rooms_reservation.service';

describe('AreaRoomsReservationService', () => {
  let service: AreaRoomsReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaRoomsReservationService],
    }).compile();

    service = module.get<AreaRoomsReservationService>(AreaRoomsReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
