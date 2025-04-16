import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryEntity } from "./inventory.entity";

@Controller('inventory')
export class InventoryController {

    constructor(private i_service: InventoryService) {

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
    async addItem(@Body() createUserOto: InventoryEntity){
        return await this.i_service.addItem(createUserOto);
    }

}
