import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AreasController } from "./areas.controller";
import { AreasService } from "./areas.service";
import { AreasEntity } from "./areas.entity";


@Module({
  imports: [TypeOrmModule.forFeature([AreasEntity])],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
