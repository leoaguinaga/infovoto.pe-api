// src/table-member/table-member.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TableMemberService } from './table-member.service';
import { CreateTableMemberDto } from './dto/create-table-member.dto';
import { UpdateTableMemberDto } from './dto/update-table-member.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Controller('table-members')
export class TableMemberController {
  constructor(private readonly tableMemberService: TableMemberService) {}

  @Post()
  create(
    @Body() createTableMemberDto: CreateTableMemberDto,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.create(createTableMemberDto);
  }

  @Get()
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.tableMemberService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableMemberDto: UpdateTableMemberDto,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.update(id, updateTableMemberDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.remove(id);
  }
}
