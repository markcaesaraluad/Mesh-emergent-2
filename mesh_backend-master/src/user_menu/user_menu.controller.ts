import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors, Response, Logger } from "@nestjs/common";
import { UserMenuService } from "./user_menu.service";
import { UserMenuEntity } from "./user_menu.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesHelper } from "src/helper";
import { diskStorage } from "multer";
import { createReadStream } from "fs";
import { join } from "path";


@Controller('user_menu')
export class UserMenuController {

    constructor(private i_service: UserMenuService) {

    }

    @Get("get_all")
    async getAll() {
        const response = await this.i_service.getAll();
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
    async addItem(@Body() createUserOto: UserMenuEntity){
        const response = await this.i_service.addItem(createUserOto);
        return response;
    }

    @Post("edit")
    async editItem(@Body() data:any) {
        const response = await this.i_service.editItem(data);
        return response;
    }

    @Post("delete")
    async deleteItem(@Body() data:any) {
        const response = await this.i_service.deleteItem(data);
        return response;
    }

    @Get("search/:name")
    async searchName(@Param('name') name: string) {
        const response = await this.i_service.searchName(name);
        return response;
    }


    @Post('upload_icon')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
        destination: '../menu_icons/',
        filename: FilesHelper.customFileName,
    })
  })
  )
  async uploadPic(@UploadedFiles() file) {

    return file;

  }

  @Get("get_file/:filename/:filetype")
    getFile(@Param('filename') filename: string, @Param('filetype') filetype: string, @Response({ passthrough: true }) res): StreamableFile {

        var content_type;

        if(filetype == "png") content_type = 'image/png';
        
        const file = createReadStream(join(process.cwd(), '../menu_icons/' + filename));
        //file.pipe(res);
        res.set({
            'Content-Type': content_type,
            'Content-Disposition': 'inline; filename=' + filename,
        });
        file.on('error', (err) => { console.error(err); });

        return new StreamableFile(file).setErrorHandler(
            err => {
                err && Logger.log(err.message);
            }
        );
    }

    @Get("get_all_page/:page/:limit")
    async getAllPage(@Param('page') page: number, @Param('limit') limit: number) {
        const response = await this.i_service.getAllPage(page, limit);
        return response;
    }



}
