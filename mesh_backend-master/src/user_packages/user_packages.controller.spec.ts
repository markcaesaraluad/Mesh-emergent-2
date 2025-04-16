import { Test, TestingModule } from '@nestjs/testing';
import { UserPackagesController } from './user_packages.controller';

describe('UserPackagesController', () => {
  let controller: UserPackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPackagesController],
    }).compile();

    controller = module.get<UserPackagesController>(UserPackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
