import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FilesHelper } from "src/helper";
import { AreaRoomsService } from "./area_rooms.service";
import { AreaRoomsEntity } from "./area_rooms.entity";

@Controller('area_rooms')
export class AreaRoomsController {

    constructor(private i_service: AreaRoomsService) {

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

    @Get("search/:name")
    async searchName(@Param('name') name: string) {
        const response = await this.i_service.searchName(name);
        return response;
    }

    @Post('add')
    async addItem(@Body() createUserOto: AreaRoomsEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Get("find_area/:id")
    async findItemArea(@Param('id') id: number) {
        const response = await this.i_service.findItemArea(id);
        return response;
    }

    @Get("find_seats/:id/:input_date")
    async findSeats(@Param('id') id: number, @Param('input_date') input_date: string) {
        const response = await this.i_service.findSeats(id,input_date);
        return response;
    }

    @Post('upload_pic')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './areas/',
            filename: FilesHelper.customFileName,
        })
    })
    )
    async uploadPic(@UploadedFiles() file) {
        return file;
    }

    @Get("get_img/:filename")
    getFile(@Param('filename') filename: string, @Param('filetype') filetype: string, @Response({ passthrough: true }) res): StreamableFile {


    const file = createReadStream(join(process.cwd(), '../areas/' + filename));
    res.set({
        'Content-Type': 'image/webp',
        'Content-Disposition': 'inline; filename=' + filename,
    });
    file.on('error', (err) => { console.error(err); });
    return new StreamableFile(file);
        
        
        
    }

}
