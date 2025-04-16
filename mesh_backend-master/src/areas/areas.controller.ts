import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FilesHelper } from "src/helper";
import { AreasService } from "./areas.service";
import { AreasEntity } from "./areas.entity";

@Controller('areas')
export class AreasController {

    constructor(private i_service: AreasService) {

    }

    @Get("all")
    async getAllItem() {
        const response = await this.i_service.getAllItem();
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

    @Get("search/:name")
    async searchName(@Param('name') name: string) {
        const response = await this.i_service.searchName(name);
        return response;
    }

    @Post('add')
    async addItem(@Body() createUserOto: AreasEntity){
        return await this.i_service.addItem(createUserOto);
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

    @Get("get_seat/:filename")
    getSeatImg(@Param('filename') filename: string, @Param('filetype') filetype: string, @Response({ passthrough: true }) res): StreamableFile {


    const file = createReadStream(join(process.cwd(), '../seat_plans/' + filename));
    res.set({
        'Content-Type': 'image/webp',
        'Content-Disposition': 'inline; filename=' + filename,
    });
    file.on('error', (err) => { console.error(err); });
    return new StreamableFile(file);
        
        
        
    }

}
