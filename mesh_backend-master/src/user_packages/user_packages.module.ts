import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPackagesEntity } from "./user_packages.entity";
import { UserPackagesController } from "./user_packages.controller";
import { UserPackagesService } from "./user_packages.service";
@Module({
  imports: [TypeOrmModule.forFeature([UserPackagesEntity])],
  controllers: [UserPackagesController],
  providers: [UserPackagesService],
})
export class UserPackagesModule {}
