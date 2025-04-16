import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryLogsEntity } from "./inventory_logs.entity";
import { InventoryLogsController } from "./inventory_logs.controller";
import { InventoryLogsService } from "./inventory_logs.service";
@Module({
  imports: [TypeOrmModule.forFeature([InventoryLogsEntity])],
  controllers: [InventoryLogsController],
  providers: [InventoryLogsService],
})
export class InventoryLogsModule {}
