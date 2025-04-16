import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatesEntity } from "./rates.entity";
import { RatesController } from "./rates.controller";
import { RatesService } from "./rates.service";
@Module({
  imports: [TypeOrmModule.forFeature([RatesEntity])],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
