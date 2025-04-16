import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { UserTypesMenuService } from "./user_types_menu.service";
import { UserTypesMenuEntity } from "./user_types_menu.entity";


@Controller('user_types_menu')
export class UserTypesMenuController {

    constructor(private i_service: UserTypesMenuService) {

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
    async addItem(@Body() createUserOto: UserTypesMenuEntity){
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

    @Get("get_menu/:id")
    async getMenu(@Param('id') id: number) {
        const response = await this.i_service.getMenu(id);
        return response;
    }

    @Post("check")
    async checkPrivilege( @Body() data: any) {
        const response = await this.i_service.checkPrivilege(data);
        return response;
    }

    @Post("assign_item")
    async assignChild(@Body() data:any) {
        const response = await this.i_service.assignChild(data);
        return response;
    }

    @Get("search_nav/:name/:ut_id")
    async searchNameNav(@Param('name') name: string, @Param('ut_id') ut_id: number) {
        const response = await this.i_service.searchNameNav(name,ut_id);
        return response;
    }

    @Get("get_list_click/:ut_id")
    async getListDataClick(@Param('ut_id') ut_id: number) {
        const response = await this.i_service.getListDataClick(ut_id);
        return response;
    }



}
