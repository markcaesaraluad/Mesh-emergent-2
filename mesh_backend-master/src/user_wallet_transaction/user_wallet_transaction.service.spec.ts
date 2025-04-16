import { Test, TestingModule } from '@nestjs/testing';
import { UserWalletTransactionService } from './user_wallet_transaction.service';

describe('UserWalletTransactionService', () => {
  let service: UserWalletTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWalletTransactionService],
    }).compile();

    service = module.get<UserWalletTransactionService>(UserWalletTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
