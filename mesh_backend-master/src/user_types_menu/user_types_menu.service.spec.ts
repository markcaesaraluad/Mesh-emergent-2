import { Test, TestingModule } from '@nestjs/testing';
import { UserTypesMenuService } from './user_types_menu.service';

describe('UserTypesMenuService', () => {
  let service: UserTypesMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTypesMenuService],
    }).compile();

    service = module.get<UserTypesMenuService>(UserTypesMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
