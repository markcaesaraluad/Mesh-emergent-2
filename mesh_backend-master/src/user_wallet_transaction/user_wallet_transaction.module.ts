import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserWalletTransactionEntity } from "./user_wallet_transaction.entity";
import { UserWalletTransactionController } from "./user_wallet_transaction.controller";
import { UserWalletTransactionService } from "./user_wallet_transaction.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserWalletTransactionEntity])],
  controllers: [UserWalletTransactionController],
  providers: [UserWalletTransactionService],
})
export class UserWalletTransactionModule {}
