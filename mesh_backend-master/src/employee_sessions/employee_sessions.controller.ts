import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response, Logger } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FilesHelper } from "src/helper";
import { EmployeeSessionsService } from "./employee_sessions.service";
import { EmployeeSessionsEntity } from "./employee_sessions.entity";

@Controller('employee_sessions')
export class EmployeeSessionsController {

    constructor(private i_service: EmployeeSessionsService) {

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
    async addItem(@Body() createUserOto: EmployeeSessionsEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Post('generate_report')
    async generateReport(@Body() file_data: any){
        const response = await this.i_service.generateReport(file_data);
        return response;
    }

    @Get("get_report/:filename")
    getRecord(@Param('filename') filename: string, @Response({ passthrough: true }) res): StreamableFile {
        
        const file = createReadStream(join(process.cwd(), '../reports/' + filename))
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=' + filename,
        });
        file.on('error', (err) => { console.error(err); });
        return new StreamableFile(file).setErrorHandler(
            err => {
                err && Logger.log(err.message);
            }
        );
    }

    
    @Get("get_time_monitoring/:date_from/:date_to/:receptionist_id/:prepared_by")
    async getTimeMonitoring(@Param('date_from') date_from: string, @Param('date_to') date_to: string, @Param('receptionist_id') receptionist_id: number,@Param('prepared_by') prepared_by: string) {
        const response = await this.i_service.getTimeMonitoring(date_from,date_to,receptionist_id,prepared_by);
        return response;
    }

    @Get("get_time_monitoring_list/:selected_date/:receptionist_id/")
    async getTimeMonitoringList(@Param('selected_date') selected_date: string, @Param('receptionist_id') receptionist_id: number) {
        const response = await this.i_service.getTimeMonitoringList(selected_date,receptionist_id);
        return response;
    }

}
