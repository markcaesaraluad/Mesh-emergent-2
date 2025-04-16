import { AreaRoomsEntity } from 'src/area_rooms/area_rooms.entity';
import { AreaRoomsReservationEntity } from 'src/area_rooms_reservation/area_rooms_reservation.entity';
import { AreasEntity } from 'src/areas/areas.entity';
import { EmployeeSessionsEntity } from 'src/employee_sessions/employee_sessions.entity';
import { InventoryEntity } from 'src/inventory/inventory.entity';
import { InventoryLogsEntity } from 'src/inventory_logs/inventory_logs.entity';
import { LogsUserEntity } from 'src/logs_user/logs_user.entity';
import { NotificationsEntity } from 'src/notifications/notifications.entity';
import { ProductsEntity } from 'src/products/products.entity';
import { RatesEntity } from 'src/rates/rates.entity';
import { TimeShiftsEntity } from 'src/time_shifts/time_shifts.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserLogsEntity } from 'src/user_logs/user_logs.entity';
import { UserMenuEntity } from 'src/user_menu/user_menu.entity';
import { UserPackagesEntity } from 'src/user_packages/user_packages.entity';
import { UserProductEntity } from 'src/user_product/user_product.entity';
import { UserSessionsEntity } from 'src/user_sessions/user_sessions.entity';
import { UserTypesEntity } from 'src/user_types/user_types.entity';
import { UserTypesMenuEntity } from 'src/user_types_menu/user_types_menu.entity';
import { UserWalletTransactionEntity } from 'src/user_wallet_transaction/user_wallet_transaction.entity';

const entities = [
    UserEntity,
    LogsUserEntity,
    NotificationsEntity,
    AreasEntity,
    EmployeeSessionsEntity,
    InventoryEntity,
    ProductsEntity,
    InventoryLogsEntity,
    RatesEntity,
    UserLogsEntity,
    UserMenuEntity,
    UserTypesMenuEntity,
    UserPackagesEntity,
    UserProductEntity,
    UserSessionsEntity,
    UserTypesEntity,
    AreaRoomsReservationEntity,
    AreaRoomsEntity,
    UserWalletTransactionEntity,
    TimeShiftsEntity
];

export {
    UserEntity,
    LogsUserEntity,
    NotificationsEntity,
    AreasEntity,
    EmployeeSessionsEntity,
    InventoryEntity,
    ProductsEntity,
    InventoryLogsEntity,
    RatesEntity,
    UserLogsEntity,
    UserMenuEntity,
    UserTypesMenuEntity,
    UserPackagesEntity,
    UserProductEntity,
    UserSessionsEntity,
    UserTypesEntity,
    AreaRoomsReservationEntity,
    AreaRoomsEntity,
    UserWalletTransactionEntity,
    TimeShiftsEntity
};

export default entities;