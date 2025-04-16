import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FilesHelper } from "src/helper";

@Controller('user')
export class UserController {

    constructor(private i_service: UserService) {

    }
    
    @Get("get_all_pending/:page/:limit/:name")
    async getAllPending(@Param('page') page: number, @Param('limit') limit: number, @Param('name') name: string) {
        const response = await this.i_service.getAllPending(page,limit,name);
        return response;
    }

    @Get("get_all/:page/:limit/:name")
    async getAll(@Param('page') page: number, @Param('limit') limit: number, @Param('name') name: string) {
        const response = await this.i_service.getAll(page,limit,name);
        return response;
    }

    @Get("get_all_filter/:page/:limit/:name/:search_type/:search_data")
    async getAllFilter(@Param('page') page: number, @Param('limit') limit: number, @Param('name') name: string, @Param('search_type') search_type: string, @Param('search_data') search_data: string) {
        const response = await this.i_service.getAllFilter(page,limit,name,search_type,search_data);
        return response;
    }

    @Get("get_all_pending_filter/:page/:limit/:name/:search_type/:search_data")
    async getAllPendingFilter(@Param('page') page: number, @Param('limit') limit: number, @Param('name') name: string, @Param('search_type') search_type: string, @Param('search_data') search_data: string) {
        const response = await this.i_service.getAllPendingFilter(page,limit,name,search_type,search_data);
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

    @Post('register')
    async registerUser(@Body() createUserOto: UserEntity){
        return await this.i_service.registerUser(createUserOto);
    }

    @Post('upload_pic')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './images/',
            filename: FilesHelper.customFileName,
        })
    })
    )
    async uploadPic(@UploadedFiles() file) {
        return file;
    }

  @Post('update_profile_pic')
    async updateProfilePic(@Body() createUserOto: UserEntity){
        const response = await this.i_service.updateProfilePic(createUserOto);
        return response;
    }

    @Get("get_img/:filename")
    getFile(@Param('filename') filename: string, @Response({ passthrough: true }) res): StreamableFile {


            const file = createReadStream(join(process.cwd(), '../images/' + filename));
            res.set({
                'Content-Type': 'image/webp',
                'Content-Disposition': 'inline; filename=' + filename,
            });
            file.on('error', (err) => { console.error(err); });
            return new StreamableFile(file);
        
        
        
    }

    @Get("find_by_number/:id")
    async findItemByNumber(@Param('id') id: string) {
        const response = await this.i_service.findItemByNumber(id);
        return response;
    }

    @Post('edit')
    async updateUser(@Body() createUserOto: UserEntity){
        return await this.i_service.updateUser(createUserOto);
    }

    @Post('update_credit')
    async updateCredit(@Body() data: any){
        return await this.i_service.updateCredit(data);
    }

    @Post('upload_screenshot')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: '../screenshots_credit',
            filename: FilesHelper.customFileName,
        })
    })
    )
    async uploadScreenshot(@UploadedFiles() file) {
        return file;
    }

    @Get("get_screenshot/:filename")
    getScreenshot(@Param('filename') filename: string, @Param('filetype') filetype: string, @Response({ passthrough: true }) res): StreamableFile {


    const file = createReadStream(join(process.cwd(), '../screenshots_credit/' + filename));
    res.set({
        'Content-Type': 'image/webp',
        'Content-Disposition': 'inline; filename=' + filename,
    });
    file.on('error', (err) => { console.error(err); });
    return new StreamableFile(file);
        
        
        
    }

    @Post('update_status')
    async updateStatus(@Body() data: any){
        return await this.i_service.updateStatus(data);
    }

}
