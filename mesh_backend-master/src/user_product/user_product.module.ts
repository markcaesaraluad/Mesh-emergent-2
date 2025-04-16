import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProductEntity } from "./user_product.entity";
import { UserProductController } from "./user_product.controller";
import { UserProductService } from "./user_product.service";
@Module({
  imports: [TypeOrmModule.forFeature([UserProductEntity])],
  controllers: [UserProductController],
  providers: [UserProductService],
})
export class UserProductModule {}
