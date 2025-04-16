import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { UserSessionsService } from "./user_sessions.service";
import { UserSessionsEntity } from "./user_sessions.entity";

@Controller('user_sessions')
export class UserSessionsController {

    constructor(private i_service: UserSessionsService) {

    }

    @Get("get_all/:page/:limit")
    async getAll(@Param('page') page: number, @Param('limit') limit: number) {
        const response = await this.i_service.getAll(page,limit);
        return response;
    }

    @Get("get_all_filter/:page/:limit/:search_type/:search_data")
    async getAllByFilter(@Param('page') page: number, @Param('limit') limit: number, @Param('search_type') search_type: string, @Param('search_data') search_data: string) {
        const response = await this.i_service.getAllByFilter(page,limit,search_type,search_data);
        return response;
    }

    @Get("get_count")
    async getCount() {
        const response = await this.i_service.getCount();
        return response;
    }

    @Get("find/:id")
    async findItem(@Param('id') id: number) {
        const response = await this.i_service.findItem(id);
        return response;
    }
    
    @Post('add')
    async addItem(@Body() createUserOto: UserSessionsEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Get("find_user_by_id/:id")
    async findItemByUserId(@Param('id') id: number) {
        const response = await this.i_service.findItemByUserId(id);
        return response;
    }

    @Get("get_max/:user_id")
    async getMaxSession(@Param('user_id') user_id: number) {
        const response = await this.i_service.getMaxSession(user_id);
        return response;
    }

    @Get("get_visits/:page/:limit/:selected_date")
    async getVisits(@Param('page') page: number, @Param('limit') limit: number, @Param('selected_date') selected_date: string) {
        const response = await this.i_service.getVisits(page,limit,selected_date);
        return response;
    }


    @Get("get_visits_filter/:page/:limit/:search_type/:search_data")
    async getVisitsByFilter(@Param('page') page: number, @Param('limit') limit: number, @Param('search_type') search_type: string, @Param('search_data') search_data: string) {
        const response = await this.i_service.getVisitsByFilter(page,limit,search_type,search_data);
        return response;
    }

}
