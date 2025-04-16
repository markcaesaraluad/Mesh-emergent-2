import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserTypesMenuEntity } from "./user_types_menu.entity";
import { UserTypesMenuController } from "./user_types_menu.controller";
import { UserTypesMenuService } from "./user_types_menu.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserTypesMenuEntity])],
  controllers: [UserTypesMenuController],
  providers: [UserTypesMenuService],
})
export class UserTypesMenuModule {}
