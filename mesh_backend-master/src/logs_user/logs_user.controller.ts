import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { LogsUserService } from "./logs_user.service";

@Controller('logs_user')
export class LogsUserController {

    constructor(private i_service: LogsUserService) {

    }

    @Get("get_remarks")
    async getAll() {
        const response = await this.i_service.getAll();
        return response;
    }


    // @Get("find_record_types/:rt_id")
    // async findTypeUser(@Param('rt_id') rt_id: number) {
    //     const response = await this.i_service.findTypeUser(rt_id);
    //     return response;
    // }




}
