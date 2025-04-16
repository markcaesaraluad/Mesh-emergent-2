import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response, Logger } from "@nestjs/common";
import { UserPackagesService } from "./user_packages.service";
import { UserPackagesEntity } from "./user_packages.entity";
import { createReadStream } from "fs";
import { join } from "path";

@Controller('user_packages')
export class UserPackagesController {

    constructor(private i_service: UserPackagesService) {

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
    async addItem(@Body() createUserOto: UserPackagesEntity){
        return await this.i_service.addItem(createUserOto);
    }

    @Get("get_max")
    async getMax() {
        const response = await this.i_service.getMax();
        return response;
    }

    @Get("check_package/:user_id")
    async checkPackage(@Param('user_id') user_id: number) {
        const response = await this.i_service.checkPackage(user_id);
        return response;
    }

    @Post('update')
    async updatePackage(@Body() data: any){
        return await this.i_service.updatePackage(data);
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

    @Get("get_sales/:date_from/:date_to/:prepared_by")
    async getSales(@Param('date_from') date_from: string, @Param('date_to') date_to: string, @Param('prepared_by') prepared_by: string) {
        const response = await this.i_service.getSales(date_from,date_to,prepared_by);
        return response;
    }

    @Get("get_sales_yearly/:year_selected/:prepared_by")
    async getSalesYearly(@Param('year_selected') year_selected: number, @Param('prepared_by') prepared_by: string) {
        const response = await this.i_service.getSalesYearly(year_selected,prepared_by);
        return response;
    }

}
