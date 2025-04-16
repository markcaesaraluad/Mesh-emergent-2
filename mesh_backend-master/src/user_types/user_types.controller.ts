import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { UserTypesEntity } from "./user_types.entity";
import { UserTypesService } from "./user_types.service";

@Controller('user_types')
export class UserTypesController {

    constructor(private i_service: UserTypesService) {

    }

    @Get("all")
    async allItems() {
        const response = await this.i_service.allItems();
        return response;
    }

    @Get("get_all/:page/:limit")
    async getAll(@Param('page') page: number, @Param('limit') limit: number) {
        const response = await this.i_service.getAll(page,limit);
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
    async addItem(@Body() createUserOto: UserTypesEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Get("find_by_name/:name")
    async findItemByName(@Param('name') name: string) {
        const response = await this.i_service.findItemByName(name);
        return response;
    }

    

}
