import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { NotificationsEntity } from './notifications.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private i_service: NotificationsService) {}

  @Get('get_record_logs')
  async getAll() {
    const response = await this.i_service.getAll();
    return response;
  }

  @Get('find/:id')
  async findItem(@Param('id') id: number) {
    const response = await this.i_service.findItem(id);
    return response;
  }

  @Post('add')
  async addItem(@Body() createUserOto: NotificationsEntity) {
    const response = await this.i_service.addItem(createUserOto);
    return response;
  }

  @Get('find_user/:id')
  async findListByRecordId(@Param('id') id: number) {
    const response = await this.i_service.findItemByUser(id);
    return response;
  }

  @Patch('read/:id')
  async read(@Param('id') id: string) {
    const response = await this.i_service.read(+id);
    return response;
  }

  // @Get("find_record_types/:rt_id")
  // async findTypeUser(@Param('rt_id') rt_id: number) {
  //     const response = await this.i_service.findTypeUser(rt_id);
  //     return response;
  // }
}
