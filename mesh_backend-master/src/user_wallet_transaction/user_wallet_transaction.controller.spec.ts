import { Test, TestingModule } from '@nestjs/testing';
import { UserWalletTransactionController } from './user_wallet_transaction.controller';

describe('UserWalletTransactionController', () => {
  let controller: UserWalletTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWalletTransactionController],
    }).compile();

    controller = module.get<UserWalletTransactionController>(UserWalletTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
