import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { RatesService } from "./rates.service";
import { RatesEntity } from "./rates.entity";

@Controller('rates')
export class RatesController {

    constructor(private i_service: RatesService) {

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
    async addItem(@Body() createUserOto: RatesEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Post("edit")
    async editItem(@Body() data:any) {
        const response = await this.i_service.editItem(data);
        return response;
    }

    @Get("find_area/:id")
    async findItemByArea(@Param('id') id: number) {
        const response = await this.i_service.findItemByArea(id);
        return response;
    }

    @Get("find_by_name/:name")
    async findItemByName(@Param('name') name: string) {
        const response = await this.i_service.findItemByName(name);
        return response;
    }

    @Get("find_by_type/:type")
    async findItemByType(@Param('type') type: number) {
        const response = await this.i_service.findItemByType(type);
        return response;
    }

    @Get("find_by_package/:type/:area_id")
    async findItemByPackage(@Param('type') type: number, @Param('area_id') area_id: number) {
        const response = await this.i_service.findItemByPackage(type,area_id);
        return response;
    }


}
