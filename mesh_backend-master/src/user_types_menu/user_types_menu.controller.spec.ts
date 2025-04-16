import { Test, TestingModule } from '@nestjs/testing';
import { UserTypesMenuController } from './user_types_menu.controller';

describe('UserTypesMenuController', () => {
  let controller: UserTypesMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTypesMenuController],
    }).compile();

    controller = module.get<UserTypesMenuController>(UserTypesMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
