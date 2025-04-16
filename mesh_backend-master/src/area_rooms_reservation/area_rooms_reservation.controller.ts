import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FilesHelper } from "src/helper";
import { AreaRoomsReservationService } from "./area_rooms_reservation.service";
import { AreaRoomsReservationEntity } from "./area_rooms_reservation.entity";

@Controller('area_rooms_reservation')
export class AreaRoomsReservationController {

    constructor(private i_service: AreaRoomsReservationService) {

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

    @Get("find_user/:id/:input_date")
    async findItemByUser(@Param('id') id: number, @Param('input_date') input_date : string) {
        const response = await this.i_service.findItemByUser(id,input_date);
        return response;
    }

    @Get("search/:name")
    async searchName(@Param('name') name: string) {
        const response = await this.i_service.searchName(name);
        return response;
    }

    @Post('add')
    async addItem(@Body() createUserOto: AreaRoomsReservationEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Post('upload_pic')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: '../areas/',
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

    @Post('upload_screenshot')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: '../screenshots',
            filename: FilesHelper.customFileName,
        })
    })
    )
    async uploadScreenshot(@UploadedFiles() file) {
        return file;
    }

    @Get("get_screenshot/:filename")
    getScreenshot(@Param('filename') filename: string, @Param('filetype') filetype: string, @Response({ passthrough: true }) res): StreamableFile {


    const file = createReadStream(join(process.cwd(), '../screenshots/' + filename));
    res.set({
        'Content-Type': 'image/webp',
        'Content-Disposition': 'inline; filename=' + filename,
    });
    file.on('error', (err) => { console.error(err); });
    return new StreamableFile(file);
        
        
        
    }

    @Post("cancel")
    async cancelAppointment(@Body() data:any) {
        const response = await this.i_service.cancelAppointment(data);
        return response;
    }

    @Get("get_incoming_appointments/:id/:status")
    async getIncomingAppointmentsCnt(@Param('id') id: number, @Param('status') status: number,) {
        const response = await this.i_service.getIncomingAppointmentsCnt(id,status);
        return response;
    }

    @Get("get_appointments/:input_date")
    async getAppointments(@Param('input_date') input_date : string) {
        const response = await this.i_service.getAppointments(input_date);
        return response;
    }

    @Post('update_appointment')
    async updateAppointment(@Body() data: any){
        return await this.i_service.updateAppointment(data);
    }

}
