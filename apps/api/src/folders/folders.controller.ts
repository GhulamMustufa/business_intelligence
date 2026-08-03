import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FoldersService } from './folders.service';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  async getFolders(@Request() req: any) {
    const userId = req.user.sub;
    return this.foldersService.getFolders(userId);
  }

  @Post()
  async createFolder(@Request() req: any, @Body('name') name: string) {
    const userId = req.user.sub;
    return this.foldersService.createFolder(userId, name);
  }

  @Put(':id')
  async updateFolder(@Param('id') id: string, @Body('name') name: string) {
    return this.foldersService.updateFolder(id, name);
  }

  @Delete(':id')
  async deleteFolder(@Param('id') id: string) {
    return this.foldersService.deleteFolder(id);
  }
}
