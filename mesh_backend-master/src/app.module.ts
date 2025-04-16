import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import entities from './entities';
import { MailsService } from './mails/mails.service';
import { MailsModule } from './mails/mails.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailsController } from './mails/mails.controller';
import { LogsUserController } from './logs_user/logs_user.controller';
import { LogsUserService } from './logs_user/logs_user.service';
import { LogsUserModule } from './logs_user/logs_user.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { AreasModule } from './areas/areas.module';
import { EmployeeSessionsController } from './employee_sessions/employee_sessions.controller';
import { EmployeeSessionsModule } from './employee_sessions/employee_sessions.module';
import { EmployeeSessionsService } from './employee_sessions/employee_sessions.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { InventoryLogsController } from './inventory_logs/inventory_logs.controller';
import { InventoryLogsService } from './inventory_logs/inventory_logs.service';
import { InventoryLogsModule } from './inventory_logs/inventory_logs.module';
import { RatesController } from './rates/rates.controller';
import { RatesService } from './rates/rates.service';
import { RatesModule } from './rates/rates.module';
import { UserLogsController } from './user_logs/user_logs.controller';
import { UserLogsService } from './user_logs/user_logs.service';
import { UserLogsModule } from './user_logs/user_logs.module';
import { UserMenuController } from './user_menu/user_menu.controller';
import { UserMenuService } from './user_menu/user_menu.service';
import { UserMenuModule } from './user_menu/user_menu.module';
import { UserTypesMenuController } from './user_types_menu/user_types_menu.controller';
import { UserTypesMenuService } from './user_types_menu/user_types_menu.service';
import { UserTypesMenuModule } from './user_types_menu/user_types_menu.module';
import { UserPackagesController } from './user_packages/user_packages.controller';
import { UserPackagesService } from './user_packages/user_packages.service';
import { UserPackagesModule } from './user_packages/user_packages.module';
import { UserProductController } from './user_product/user_product.controller';
import { UserProductService } from './user_product/user_product.service';
import { UserProductModule } from './user_product/user_product.module';
import { UserSessionsController } from './user_sessions/user_sessions.controller';
import { UserSessionsService } from './user_sessions/user_sessions.service';
import { UserSessionsModule } from './user_sessions/user_sessions.module';
import { UserTypesController } from './user_types/user_types.controller';
import { UserTypesService } from './user_types/user_types.service';
import { UserTypesModule } from './user_types/user_types.module';
import { AreaRoomsReservationController } from './area_rooms_reservation/area_rooms_reservation.controller';
import { AreaRoomsReservationModule } from './area_rooms_reservation/area_rooms_reservation.module';
import { AreaRoomsReservationService } from './area_rooms_reservation/area_rooms_reservation.service';
import { AreaRoomsController } from './area_rooms/area_rooms.controller';
import { AreaRoomsService } from './area_rooms/area_rooms.service';
import { AreaRoomsModule } from './area_rooms/area_rooms.module';
import { TimeShiftsController } from './time_shifts/time_shifts.controller';
import { TimeShiftsService } from './time_shifts/time_shifts.service';
import { TimeShiftsModule } from './time_shifts/time_shifts.module';
import { UserWalletTransactionController } from './user_wallet_transaction/user_wallet_transaction.controller';
import { UserWalletTransactionService } from './user_wallet_transaction/user_wallet_transaction.service';
import { UserWalletTransactionModule } from './user_wallet_transaction/user_wallet_transaction.module';
import { NotifsModule } from './notifs/notifs.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MulterModule.register({
      dest: '../images',
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: entities,
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    MailsModule,
    LogsUserModule,
    NotificationsModule,
    AreasModule,
    EmployeeSessionsModule,
    InventoryModule,
    ProductsModule,
    InventoryLogsModule,
    RatesModule,
    UserLogsModule,
    UserMenuModule,
    UserTypesMenuModule,
    UserPackagesModule,
    UserProductModule,
    UserSessionsModule,
    UserTypesModule,
    AreaRoomsReservationModule,
    AreaRoomsModule,
    TimeShiftsModule,
    UserWalletTransactionModule,
    NotifsModule,
  ],
  controllers: [
    AppController,
    MailsController,
    LogsUserController,
    NotificationsController,
    AreasController,
    EmployeeSessionsController,
    InventoryController,
    ProductsController,
    InventoryLogsController,
    RatesController,
    UserLogsController,
    UserMenuController,
    UserTypesMenuController,
    UserPackagesController,
    UserProductController,
    UserSessionsController,
    UserTypesController,
    AreaRoomsReservationController,
    AreaRoomsController,
    TimeShiftsController,
    UserWalletTransactionController,
  ],
  providers: [
    AppService,
    MailsService,
    LogsUserService,
    NotificationsService,
    AreasService,
    EmployeeSessionsService,
    InventoryService,
    ProductsService,
    InventoryLogsService,
    RatesService,
    UserLogsService,
    UserMenuService,
    UserTypesMenuService,
    UserPackagesService,
    UserProductService,
    UserSessionsService,
    UserTypesService,
    AreaRoomsReservationService,
    AreaRoomsService,
    TimeShiftsService,
    UserWalletTransactionService,
  ],
})
export class AppModule {}
